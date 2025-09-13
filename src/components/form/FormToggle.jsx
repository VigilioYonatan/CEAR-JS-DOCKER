import {
    EyeIconLight,
    EyeSlashIconLight,
    QuestionIconLight,
} from "@vigilio/react-icons/fontawesome";
import { useContext } from "preact/hooks";
import { sizeIcon } from "../../libs/client/helpers";
import { anidarPropiedades } from ".";
import { FormControlContext } from "./Form";

/**
 * @typedef {Object} FormToggleProps
 * @property {string} title - Texto de etiqueta para el toggle.
 * @property {string} name - Nombre del campo del formulario.
 * @property {JSX.Element | JSX.Element[] | string} [question] - Elemento o texto de ayuda.
 * @property {Object} [options] - Opciones de registro (react-hook-form).
 * @property {JSX.Element | JSX.Element[]} [ico] - Ícono opcional.
 * @property {boolean} [isEye=false] - Indica si se muestra toggle tipo ojo.
 * @property {boolean} [required=false] - Indica si es obligatorio.
 * @property {Object} [rest] - Otros props de input.
 */

/**
 * Componente toggle para formulario con integración react-hook-form.
 *
 * @param {FormToggleProps} props
 * @returns {JSX.Element}
 */
function FormToggle({
    name,
    title,
    question,
    isEye = false,
    required = false,
    ...rest
}) {
    const {
        register,
        formState: { errors },
        watch,
        setValue,
    } = useContext(FormControlContext);

    const value = watch(name);

    const err = anidarPropiedades(errors, name.split("."));
    const nameId = `${name}-${Date.now()}`;

    const toggleValue = () => {
        setValue(name, !value);
    };

    return (
        <div className="w-full mb-2 space-y-2">
            <label
                className="block text-sm font-medium text-foreground"
                htmlFor={nameId}
            >
                {title}
                {required ? <span className="text-primary">*</span> : ""}
            </label>
            <div className="flex items-center gap-2">
                <div className="w-full h-[2.5rem] flex items-center gap-2 text-xs rounded-lg overflow-hidden text-secondary-dark bg-paper-light my-1">
                    {isEye ? (
                        <button
                            type="button"
                            onClick={toggleValue}
                            className="p-2 focus:outline-none"
                            aria-label={value ? "Ocultar" : "Mostrar"}
                        >
                            {value ? (
                                <EyeIconLight
                                    {...sizeIcon.large}
                                    className="text-primary"
                                />
                            ) : (
                                <EyeSlashIconLight
                                    {...sizeIcon.large}
                                    className="text-gray-500"
                                />
                            )}
                        </button>
                    ) : (
                        <>
                            <input
                                type="checkbox"
                                id={nameId}
                                {...rest}
                                checked={value}
                                {...register(name)}
                                className="hidden"
                            />
                            <label
                                htmlFor={nameId}
                                className={`relative inline-flex items-center cursor-pointer w-[4rem] h-8 rounded-full transition-all duration-300 ${
                                    value ? "bg-primary" : "bg-gray-300"
                                }`}
                            >
                                <span
                                    className={`absolute block w-8 h-8 bg-white rounded-full transition-transform duration-300 transform ${
                                        value
                                            ? "translate-x-6"
                                            : "translate-x-0"
                                    }`}
                                />
                            </label>
                        </>
                    )}
                </div>

                {question ? (
                    <div className="relative group">
                        <div className="rounded-full shadow-lg p-1 bg-primary fill-white">
                            <QuestionIconLight className="w-[12px] h-[12px]" />
                        </div>
                        <div className="shadow-xl text-xs min-w-[100px] hidden group-hover:block -top-[35px] right-1 p-1 text-center absolute rounded-md bg-white z-10 font-semibold text-black">
                            {question}
                        </div>
                    </div>
                ) : null}
            </div>

            {Object.keys(err).length ? (
                <p className="text-xs text-red-600">{err.message}</p>
            ) : null}
        </div>
    );
}

/**
 * @typedef {Object} FormToggleCustomProps
 * @property {string} title - Texto de etiqueta.
 * @property {Signal<boolean>} value - Señal para el valor del toggle.
 * @property {number} [index] - Índice opcional para ID único.
 * @property {(value: boolean) => void} [onChange] - Callback para cambio de valor.
 * @property {boolean} [isEye=false] - Mostrar toggle tipo ojo.
 */

/**
 * Toggle personalizado usando señales para manejo de estado.
 *
 * @param {FormToggleCustomProps} props
 * @returns {JSX.Element}
 */
export function FormToggleCustom({
    title,
    value,
    index,
    onChange,
    isEye = false,
}) {
    const nameId = `${title}-${index ?? Date.now()}`;

    const toggleValue = () => {
        const newValue = !value.value;
        value.value = newValue;
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <div className="w-full mb-2">
            <label
                className="text-sm text-secondary-dark capitalize font-bold"
                htmlFor={nameId}
            >
                {title}
            </label>
            <div className="flex items-center gap-2">
                <div className="w-full h-[2.5rem] flex items-center gap-2 text-xs rounded-lg overflow-hidden text-secondary-dark bg-paper-light my-1">
                    {isEye ? (
                        <button
                            type="button"
                            onClick={toggleValue}
                            className="p-2 focus:outline-none"
                            aria-label={value.value ? "Ocultar" : "Mostrar"}
                        >
                            {value.value ? (
                                <EyeIconLight className="w-5 h-5 text-primary" />
                            ) : (
                                <EyeSlashIconLight className="w-5 h-5 text-gray-500" />
                            )}
                        </button>
                    ) : (
                        <>
                            <input
                                type="checkbox"
                                id={nameId}
                                checked={value.value}
                                className="hidden"
                                onChange={(e) => {
                                    value.value = e.target.checked;
                                    if (onChange) onChange(value.value);
                                }}
                            />
                            <label
                                htmlFor={nameId}
                                className={`relative inline-flex items-center cursor-pointer w-[4rem] h-8 rounded-full transition-all duration-300 ${
                                    value.value ? "bg-primary" : "bg-gray-300"
                                }`}
                            >
                                <span
                                    className={`absolute block w-8 h-8 bg-white rounded-full transition-transform duration-300 transform ${
                                        value.value
                                            ? "translate-x-6"
                                            : "translate-x-0"
                                    }`}
                                />
                            </label>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FormToggle;
