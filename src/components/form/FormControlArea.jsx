import { QuestionIconLight } from "@vigilio/react-icons/fontawesome";
import { useContext, useState } from "preact/hooks";
import { cn } from "../../libs/client/helpers";
import { anidarPropiedades } from ".";
import { FormControlContext } from "./Form";

/**
 * @typedef {object} FormControlAreaProps
 * @property {string} title - Label del campo
 * @property {string} name - Nombre del campo (path para react-hook-form)
 * @property {JSX.Element | JSX.Element[] | string} [question] - Tooltip opcional
 * @property {object} [options] - Opciones de validación (react-hook-form)
 * @property {number} [contentMaxLength] - Máximo de caracteres a mostrar
 * @property {boolean} [isFloating] - Si el label debe flotar
 * @property {boolean} [required] - Si el campo es requerido
 * @property {string} [placeholder] - Texto placeholder
 * @property {number} [rows] - Número de filas
 * @property {boolean} [disabled] - Desactiva el textarea
 * @property {string} [className] - Clases CSS adicionales
 * @property {(e: FocusEvent) => void} [onFocus] - Evento focus
 * @property {(e: FocusEvent) => void} [onBlur] - Evento blur
 */

/**
 * Textarea controlado por react-hook-form.
 *
 * @param {FormControlAreaProps} props
 * @returns {JSX.Element}
 */
function FormControlArea({
    name,
    title,
    question,
    options = {},
    isFloating = false,
    contentMaxLength,
    ...rest
}) {
    const [isFocused, setIsFocused] = useState(false);
    const {
        register,
        formState: { errors },
        watch,
    } = useContext(FormControlContext);

    const err = anidarPropiedades(errors, name.split("."));
    const value = watch(name);

    return (
        <div class="space-y-2 w-full">
            {title && (
                <label
                    htmlFor={name}
                    class={`block text-sm font-medium text-foreground ${
                        isFloating
                            ? "absolute -mt-3 ml-3 px-1 bg-background z-10"
                            : ""
                    }`}
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
                <textarea
                    class={cn(
                        "w-full py-2 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-ring/30",
                        "transition-all duration-200 backdrop-blur-sm px-4",
                        isFocused && "bg-accent/50",
                        Object.keys(err).length &&
                            "!border-destructive !focus:ring-destructive/20 !focus:border-destructive",
                        rest.disabled &&
                            "opacity-50 cursor-not-allowed bg-muted/30",
                        isFloating && "pt-3",
                        rest.className || ""
                    )}
                    id={name}
                    rows={rest.rows}
                    value={value}
                    onBlur={(event) => {
                        setIsFocused(false);
                        rest.onBlur?.(event);
                    }}
                    onFocus={(event) => {
                        setIsFocused(true);
                        rest.onFocus?.(event);
                    }}
                    {...register(name, options)}
                    autoComplete="off"
                    placeholder={rest.placeholder}
                    disabled={rest.disabled}
                />

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

            <div className="flex justify-between">
                {Object.keys(err).length ? (
                    <p className="text-sm text-destructive flex items-center gap-1">
                        <span className="w-1 h-1 bg-destructive rounded-full" />
                        {err?.message}
                    </p>
                ) : (
                    <div />
                )}

                {contentMaxLength && (
                    <p className="text-xs text-muted-foreground">
                        {(value || "").length}/{contentMaxLength}
                    </p>
                )}
            </div>
        </div>
    );
}

export default FormControlArea;
