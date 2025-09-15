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
    regex,
    string,
    union,
} from "@vigilio/valibot";

const userSchema = object({
    id: number(),
    name: string([minLength(3), maxLength(255)]),
    lastname: string([minLength(3), maxLength(255)]),
    age: number(),
    email: string([email()]),
    password: string([
        regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial"
        ),
    ]),
    address: object({
        street: string([minLength(3), maxLength(255)]),
        city: string([minLength(3), maxLength(255)]),
        state: string([minLength(3), maxLength(255)]),
        zip: string([minLength(3), maxLength(255)]),
    }),
    genero: union([literal("masculino"), literal("femenino")]),
    fecha: coerce(date(), (val) => new Date(val)),
    estado: boolean(),
});
export default userSchema;
