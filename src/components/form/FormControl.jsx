import {
    EyeIconLight,
    EyeSlashIconLight,
    QuestionIconLight,
} from "@vigilio/react-icons";
import { useContext, useState } from "preact/hooks";
import { cn } from "../../libs/client/helpers";
import { anidarPropiedades } from ".";
import { FormControlContext } from "./Form";

/**
 * FormControl component for rendering a labeled input with validation and optional icons.
 *
 * @param {Object} props - Props for the component.
 * @param {string} props.title - The label/title of the input.
 * @param {string} props.name - The name/path of the input field in the form.
 * @param {string} [props.type] - The input type (e.g., text, password). Default is "text".
 * @param {JSX.Element | JSX.Element[] | string} [props.question] - Optional question/help tooltip content.
 * @param {Object} [props.options] - React Hook Form validation options.
 * @param {JSX.Element | JSX.Element[]} [props.ico] - Optional icon to display inside the input.
 * @param {string} [props.className] - Additional CSS class names.
 * @param {boolean} [props.required] - Whether the input is required.
 * @param {boolean} [props.disabled] - Whether the input is disabled.
 * @returns {JSX.Element} The rendered form control.
 */
function FormControl({
    name,
    title,
    type = "text",
    question,
    options = {},
    ico,
    className,
    ...rest
}) {
    const formContext = useContext(FormControlContext);
    const register = formContext?.register;
    const errors = formContext?.formState?.errors || {};

    const [hidden, setHidden] = useState(true);
    const [isFocused, setIsFocused] = useState(false);

    function onChangeHidde() {
        setHidden(!hidden);
    }

    const err = anidarPropiedades(errors, name.split("."));
    const isPassword = type === "password";
    const inputType = isPassword && !hidden ? "text" : type;

    return (
        <div class="space-y-2 w-full">
            {title && (
                <label
                    htmlFor={name}
                    class="block text-sm font-medium text-foreground"
                >
                    {title}
                    {rest.required ? (
                        <span className="text-primary">*</span>
                    ) : (
                        ""
                    )}
                </label>
            )}

            <div class="relative flex gap-2">
                {ico && (
                    <div
                        class={cn(
                            "absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-muted-foreground rounded-l-lg bg-primary z-1 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:fill-white"
                        )}
                    >
                        {ico}
                    </div>
                )}
                <input
                    class={cn(
                        "w-full py-2 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-ring/30",
                        "transition-all duration-200",
                        "backdrop-blur-sm",
                        isFocused && "bg-accent/50",
                        Object.keys(err).length &&
                            "!border-destructive !focus:ring-destructive/20 !focus:border-destructive",
                        rest.disabled &&
                            "opacity-50 cursor-not-allowed bg-muted/30",
                        ico && "pl-14",
                        ico ? "pr-6 pl-14" : "px-4",
                        className
                    )}
                    id={name}
                    type={inputType}
                    autoComplete="off"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...rest}
                    {...(register ? register(name, options) : {})}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={onChangeHidde}
                        className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors fill-muted-foreground"
                    >
                        {hidden ? (
                            <EyeSlashIconLight class="w-5 h-5" />
                        ) : (
                            <EyeIconLight class="w-5 h-5" />
                        )}
                    </button>
                )}

                {question && (
                    <div className="relative group self-center">
                        <div className="rounded-full shadow-lg p-1 bg-primary fill-white">
                            <QuestionIconLight class="w-[12px] h-[12px]" />
                        </div>
                        <div className="shadow-xl text-xs min-w-[100px] hidden group-hover:block -top-[35px] right-1 p-1 text-center absolute rounded-md bg-white z-10 font-semibold text-black">
                            {question}
                        </div>
                    </div>
                )}
            </div>

            {Object.keys(err).length ? (
                <p className="text-sm text-destructive flex items-center gap-1">
                    <span className="w-1 h-1 bg-destructive rounded-full" />
                    {err?.message}
                </p>
            ) : null}
        </div>
    );
}

export default FormControl;
