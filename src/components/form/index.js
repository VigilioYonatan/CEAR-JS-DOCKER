import VigilioForm from "./Form";
import FormControlArea from "./FormArea";
import FormArray from "./FormArray";
import FormButtonSubmit from "./FormButtonSubmit";
import FormColor from "./FormColor";
import FormControl from "./FormControl";
import FormSelect from "./FormSelect";
import FormSelectInput from "./FormSelectInput";
import FormToggle from "./FormToggle";

/**
 * Anida propiedades dentro de un objeto dado un array de claves.
 * Si alguna clave no existe, la crea como un objeto vacío.
 *
 * @template T
 * @param {import("react-hook-form").FieldErrors<T>} obj - Objeto de errores.
 * @param {string[]} keysArray - Array de claves para anidar.
 * @returns {any} - Objeto anidado accedido mediante las claves.
 */
export function anidarPropiedades(obj, keysArray) {
    /** @type {any} */
    let currentObj = obj;
    for (let i = 0; i < keysArray.length; i++) {
        const key = keysArray[i];
        // Comprueba si la propiedad existe directamente en el objeto
        if (!Object.hasOwn(currentObj, key)) {
            currentObj[key] = {};
        }
        currentObj = currentObj[key];
    }
    return currentObj;
}

/**
 * Componente Form principal con componentes auxiliares anidados.
 */
const Form = Object.assign(VigilioForm, {
    control: Object.assign(FormControl, {
        toggle: FormToggle,
        select: FormSelect,
        area: FormControlArea,
        array: FormArray,
        selectInput: FormSelectInput,
        color: FormColor,
    }),
    button: { submit: FormButtonSubmit },
});

export default Form;
