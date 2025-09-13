import { useSignal } from "@preact/signals";
import { useContext, useEffect, useState } from "preact/hooks";
import useDropdown from "../../hooks/useDropdown";
import { cn } from "../../libs/client/helpers";
import { anidarPropiedades } from ".";
import { FormControlContext } from "./Form";

/**
 * @typedef {Object} FormSelectInputProps
 * @property {string} title - The label for the select input field.
 * @property {string} name - The name of the field.
 * @property {JSX.Element|string|JSX.Element[]} [question] - Optional additional information about the field.
 * @property {JSX.Element|JSX.Element[]} [ico] - Optional icon to display inside the input.
 * @property {Object} [options] - React Hook Form validation options.
 * @property {Array<{value: string, key: any}>} array - The list of options to be shown in the select dropdown.
 * @property {string} [placeholder] - Placeholder text for the input.
 * @property {boolean} [isLoading] - Whether the input is in a loading state.
 * @property {string} [className] - Additional CSS classes for the input element.
 */

/**
 * A form input component for selecting an option from a dropdown.
 *
 * @param {FormSelectInputProps} props - The component props.
 * @returns {JSX.Element} The rendered JSX for the select input.
 */
function FormSelectInput({
    name,
    title,
    question,
    ico,
    array,
    options,
    isLoading = false,
    className,
    ...rest
}) {
    const {
        register,
        formState: { errors },
        setValue,
        getValues,
    } = useContext(FormControlContext);

    const dropdown = useDropdown();

    const err = anidarPropiedades(errors, name.split("."));
    const input = useSignal(null);
    const [isFocused, setIsFocused] = useState(false);

    // Use signal for value array
    const valueArray = useSignal([]);
    const value = getValues(name);

    // Update value array based on user input
    useEffect(() => {
        if (array.length) {
            if (!input.value || !input.value?.length) {
                valueArray.value = [];
                setValue(name, null);
                return;
            }
            valueArray.value = array
                .filter((val) =>
                    new RegExp(input.value.toLowerCase(), "i").test(
                        val.value.toLowerCase()
                    )
                )
                .slice(0, 8);
            if (!valueArray.value.length) {
                setValue(name, null);
            }
        }
    }, [input.value, array]);

    // Set initial value when the form is populated
    useEffect(() => {
        if (value) {
            const data = array.find((val) => val.key === value) ?? null;
            if (data) {
                input.value = data.value;
                setValue(name, data.key);
            }
        }
    }, [value]);

    // Set value again when the array changes
    useEffect(() => {
        if (value) {
            const data = array.find((val) => val.key === value) ?? null;
            if (data) {
                input.value = data.value;
                setValue(name, data.key);
            }
        }
    }, [array]);

    return (
        <div className="w-full mb-2 relative space-y-2">
            <label
                className="text-secondary-dark capitalize font-bold text-sm"
                htmlFor={name}
            >
                {title}
                {rest.required ? <span className="text-primary">*</span> : ""}
            </label>
            <div className="flex items-center gap-2 relative w-full">
                <div className="relative flex gap-2 w-full">
                    {ico && (
                        <div
                            className={cn(
                                "absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-muted-foreground rounded-l-lg bg-primary z-1 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:fill-white"
                            )}
                        >
                            {ico}
                        </div>
                    )}

                    {dropdown.dropdownOpen && (
                        <div
                            className="absolute p-2 rounded-md shadow top-12 left-0 right-0 z-[10] bg-white"
                            ref={dropdown.dropdown}
                        >
                            {valueArray.value.length ? (
                                valueArray.value.map((val) => (
                                    <button
                                        type="button"
                                        className="w-full text-sm py-1.5 hover:bg-gray-200 line-clamp-1"
                                        key={val.key}
                                        onClick={() => {
                                            setValue(name, val.key);
                                            input.value = val.value;
                                            dropdown.onClose();
                                        }}
                                    >
                                        {val.value}
                                    </button>
                                ))
                            ) : (
                                <span className="dark:text-white text-xs w-full text-center block py-2">
                                    No se encontró resultados
                                </span>
                            )}
                        </div>
                    )}

                    <input
                        className={cn(
                            "w-full py-2 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground",
                            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-ring/30",
                            "transition-all duration-200",
                            "backdrop-blur-sm",
                            isFocused && "bg-accent/50",
                            !!Object.keys(err).length &&
                                "!border-destructive !focus:ring-destructive/20 !focus:border-destructive",
                            rest.disabled &&
                                "opacity-50 cursor-not-allowed bg-muted/30",
                            ico && "pl-14",
                            ico ? "pr-6 pl-11" : "px-4",
                            className
                        )}
                        id={name}
                        {...rest}
                        onChange={(e) => {
                            input.value = e.target.value;
                            if (dropdown.dropdownOpen) return;
                            dropdown.onOpen();
                        }}
                        value={input.value ?? ""}
                        disabled={isLoading || false}
                        autocomplete="off"
                    />

                    <input type="hidden" {...register(name, options)} />
                </div>

                {question && (
                    <div className="relative group">
                        <i className="fa-solid fa-circle-question text-xs dark:text-white" />
                        <div className="text-xs min-w-[200px] max-w-[250px] hidden group-hover:block -top-[35px] right-1 p-1 shadow text-center absolute rounded-md dark:bg-admin-background-dark bg-background-light dark:text-white font-semibold">
                            {question}
                        </div>
                    </div>
                )}
            </div>
            <div
                className={`${isLoading ? "loading-bar" : ""} w-full h-[2px]`}
            />
            {Object.keys(err).length ? (
                <p className="text-xs text-red-600">{err?.message}</p>
            ) : null}
            <style jsx>{`
                @keyframes loadingAnimation {
                    0% {
                        left: -100%;
                        width: 100%;
                    }
                    50% {
                        left: 0%;
                        width: 10%;
                    }
                    100% {
                        left: 100%;
                        width: 100%;
                    }
                }

                .loading-bar {
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                }

                .loading-bar::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    background-color: currentColor;
                    animation: loadingAnimation 2s infinite;
                }
            `}</style>
        </div>
    );
}

export default FormSelectInput;
