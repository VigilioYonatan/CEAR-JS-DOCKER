import {
    boolean,
    coerce,
    date,
    email,
    literal,
    maxLength,
    minLength,
    number,
    object,
    string,
    union,
} from "@vigilio/valibot";

const userSchema = object({
    id: string(),
    name: string([minLength(3), maxLength(255)]),
    age: number(),
    email: string([email()]),
    password: string([]),
    genero: union([literal("masculino"), literal("femenino")]),
    fecha: coerce(date(), (val) => new Date(val)),
    estado: boolean(),
});
export default userSchema;
