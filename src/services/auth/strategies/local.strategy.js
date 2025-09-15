import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../../../config/server/db.config";

export function localStrategy() {
    return new LocalStrategy(
        { usernameField: "email", passReqToCallback: true },
        async (_, email, password, done) => {
            const user = await User.unscoped().findOne({
                where: {
                    email,
                },
                attributes: [
                    "id",
                    "role",
                    "email",
                    "password",
                    // .../puede ser necesario agregar mas campos
                ],
                raw: true,
            });

            if (!user) {
                return done(null, false, {
                    message: "Correo Electrónico ó contranseña incorrecta.",
                });
            }
            //

            if (!user.password) {
                return done(null, false, {
                    message:
                        "Este usuario no tiene contraseña, comunicarse con personal para generar uno.",
                });
            }
            const verifyPassword = bcrypt.compareSync(password, user.password);

            if (!verifyPassword) {
                return done(null, false, {
                    message: "Correo Electrónico ó contranseña incorrecta.",
                });
            }

            return done(null, user);
        }
    );
}
