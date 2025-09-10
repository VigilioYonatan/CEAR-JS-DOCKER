import { email, object, string } from "@vigilio/valibot";

const userSchema = object({
    id: string(),
    name: string([minLength(3), maxLength(255)]),
    email: string([email()]),
    password: string([]),
    genero: union([literal("masculino"), literal("femenino")]),
});
export default userSchema;
