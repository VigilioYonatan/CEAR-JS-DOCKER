import { useComputed, useSignal } from "@preact/signals";
import { MagnifyingGlassIconLight } from "@vigilio/react-icons/fontawesome";
import { useContext, useEffect } from "preact/hooks";
import { cn } from "../../libs/client/helpers";
import { anidarPropiedades } from ".";
import { FormControlContext } from "./Form";

/**
 * @typedef {Object} SavedSearchItem
 * @property {unknown} id
 * @property {string} value
 */

/**
 * FormArray component for managing array input with search and pagination.
 *
 * @param {Object} props
 * @param {string} props.title - Label text.
 * @param {string} props.name - Form field name.
 * @param {Object} props.paginator - UsePaginator instance for searching.
 * @param {Object} props.query - UseQuery instance with paginated results.
 * @param {(item: any) => SavedSearchItem} props.onValue - Maps result to saved search item.
 * @param {string} [props.placeholder] - Placeholder for input.
 * @param {number} [props.max] - Maximum allowed items.
 * @param {boolean} [props.isUnique] - Whether only one unique value allowed.
 * @param {boolean} [props.disabled] - Disable input.
 * @param {string} [props.defaultValue] - Default input value.
 * @param {string} [props.className] - Additional classes.
 * @param {import("preact").JSX.Element | import("preact").JSX.Element[]} [props.ico] - Icon element.
 * @param {boolean} [props.required] - Marks input as required.
 * @returns {import("preact").JSX.Element}
 */
function FormArray({
    name,
    title,
    paginator,
    query,
    onValue,
    placeholder,
    max,
    isUnique,
    disabled,
    defaultValue,
    className,
    ico,
    required,
}) {
    const isFocused = useSignal(false);
    const savedSearches = useSignal([]);
    const showSuggestions = useSignal(false);

    const {
        formState: { errors },
        setValue,
        watch,
    } = useContext(FormControlContext);
    const err = anidarPropiedades(errors, name.split("."));
    const value = watch(name);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        paginator.search.onSearchByName(val);
        showSuggestions.value = true;
    };

    const valueFormated = (isUnique ? [value] : value || []).filter(Boolean);

    const addToSavedSearches = (item) => {
        if (max && valueFormated.length >= max) return;

        setValue(name, isUnique ? item.id : [...(value || []), item.id]);

        savedSearches.value = [...savedSearches.value, item];
        paginator.search.onSearchByName("");
    };

    const handleSelectSuggestion = (item) => {
        paginator.search.onSearchByName("");
        showSuggestions.value = false;
        addToSavedSearches(item);
    };

    const handleRemoveItem = (id) => {
        savedSearches.value = savedSearches.value.filter(
            (item) => item.id !== id
        );

        setValue(
            name,
            isUnique ? null : valueFormated.filter((itemId) => itemId !== id)
        );
    };

    const hasSearches = useComputed(() => savedSearches.value.length > 0);

    useEffect(() => {
        if (max && valueFormated.length >= max) return;
        if (paginator.search.debounceTerm.length) {
            query.refetch(false);
        }
    }, [value, paginator.search.debounceTerm]);

    const data = query.data?.results
        .map(onValue)
        .filter((item) => !valueFormated.includes(item.id));

    return (
        <div className={cn("space-y-2 w-full", className)}>
            {title && (
                <label
                    className="block text-sm font-medium text-foreground"
                    htmlFor={`${name}-search`}
                >
                    {title}{" "}
                    {required ? <span className="text-primary">*</span> : ""}
                </label>
            )}

            <div className="relative">
                <div className="flex relative items-center">
                    {ico ? (
                        <div
                            className={cn(
                                "absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-muted-foreground rounded-l-lg bg-primary z-1 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:fill-white"
                            )}
                        >
                            {ico}
                        </div>
                    ) : (
                        <button
                            type="button"
                            className={cn(
                                "absolute left-2 text-muted-foreground hover:text-primary transition-colors",
                                disabled && "opacity-50 cursor-not-allowed"
                            )}
                            disabled={disabled}
                        >
                            <MagnifyingGlassIconLight width={18} />
                        </button>
                    )}

                    <input
                        id={`${name}-search`}
                        type="text"
                        value={
                            defaultValue ||
                            (isUnique && valueFormated.length
                                ? savedSearches.value.find(
                                      (item) => item.id === value
                                  )?.value
                                : paginator.search.value)
                        }
                        onChange={handleSearchChange}
                        onFocus={() => {
                            showSuggestions.value = true;
                            isFocused.value = true;
                        }}
                        onBlur={() =>
                            setTimeout(() => {
                                showSuggestions.value = false;
                            }, 200)
                        }
                        placeholder={placeholder || ""}
                        className={cn(
                            "flex-1 py-2 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground",
                            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-ring/30",
                            "transition-all duration-200 pl-10",
                            isFocused.value && "bg-accent/50",
                            !!Object.keys(err).length &&
                                "!border-destructive !focus:ring-destructive/20 focus:border-destructive",
                            disabled &&
                                "opacity-50 cursor-not-allowed bg-muted/30",
                            ico ? "pl-10" : "pl-3"
                        )}
                        aria-haspopup="listbox"
                        disabled={
                            (max && valueFormated.length >= max) ||
                            disabled ||
                            false
                        }
                    />
                </div>

                {showSuggestions.value && data && data.length > 0 && (
                    <div className="absolute z-20 mt-1 w-full bg-background border border-input rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <ul className="divide-y divide-input">
                            {data.map((item) => (
                                <li key={String(item.id)}>
                                    <button
                                        onClick={() =>
                                            handleSelectSuggestion(item)
                                        }
                                        type="button"
                                        className={cn(
                                            "px-4 py-2 w-full text-left text-foreground",
                                            "hover:bg-accent focus:bg-accent transition-colors duration-150",
                                            "flex items-center gap-2"
                                        )}
                                    >
                                        {item.value}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {hasSearches.value && (
                <div className="mt-2">
                    <div className="max-h-[200px] overflow-y-auto p-1">
                        <ul className="flex flex-wrap gap-2">
                            {savedSearches.value.map((item) => (
                                <li
                                    key={String(item.id)}
                                    className={cn(
                                        "py-1.5 px-3 rounded-full shadow-sm flex items-center gap-2",
                                        "bg-accent text-accent-foreground border border-input/50",
                                        "relative pr-6 group"
                                    )}
                                >
                                    <span className="text-sm">
                                        {item.value}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveItem(item.id)
                                        }
                                        className={cn(
                                            "absolute -top-1 -right-1 rounded-full w-4 h-4 flex justify-center items-center",
                                            "bg-destructive text-destructive-foreground text-xs font-bold",
                                            "opacity-0 group-hover:opacity-100 transition-opacity",
                                            "hover:bg-destructive/90"
                                        )}
                                        aria-label="Remove item"
                                    >
                                        ×
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {Object.keys(err).length ? (
                <p className="text-sm text-destructive flex items-center gap-1">
                    <span className="w-1 h-1 bg-destructive rounded-full" />
                    {err.message}
                </p>
            ) : (
                <span className="h-3 block w-full" />
            )}
        </div>
    );
}

export default FormArray;
