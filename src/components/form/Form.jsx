import { createContext } from "preact";

/**
 * Contexto para el control del formulario basado en react-hook-form.
 * @type {import('preact').Context<import('react-hook-form').UseFormReturn<any, unknown, import('react-hook-form').FieldValues>>}
 */
export const FormControlContext = createContext(
    /** @type {import('react-hook-form').UseFormReturn<any, unknown, import('react-hook-form').FieldValues>} */ ({})
);

/**
 * Props del componente Form.
 * @template T
 * @typedef {Object} FormProps
 * @property {import('react-hook-form').UseFormReturn<T>} rest - Métodos y estado de react-hook-form.
 * @property {import('preact').JSX.Element | import('preact').JSX.Element[] | null} children - Contenido interno del formulario.
 * @property {(data: T) => void} onSubmit - Función llamada al enviar el formulario con datos validados.
 * @property {string} [className] - Clase CSS opcional para el formulario.
 */

/**
 * Componente Form que provee contexto para react-hook-form y envuelve un formulario HTML.
 * @template T
 * @param {FormProps<T>} props
 */
function Form({
    children,
    onSubmit,
    className = "w-full flex flex-col gap-4",
    ...rest
}) {
    return (
        // Pasamos todos los métodos de react-hook-form como valor del contexto.
        <FormControlContext.Provider value={rest}>
            <form
                noValidate
                onSubmit={rest.handleSubmit(onSubmit)}
                className={className}
                autoComplete="off"
            >
                {children}
            </form>
        </FormControlContext.Provider>
    );
}

export default Form;
