import bcrypt from "bcryptjs";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import enviroments from "~/config/server/environments.config";
import { User } from "../../../config/server/db.config";

export function jwtStrategy() {
    return new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: enviroments.JWT_KEY,
            passReqToCallback: true,
        },
        async (_, body, done) => {
            const user = await User.findOne({
                where: {
                    email: body.email,
                },
                attributes: [
                    "id",
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

            if (!user.password) {
                return done(null, false, {
                    message:
                        "Este usuario no tiene contraseña, comunicarse con personal para generar uno.",
                });
            }
            const verifyPassword = bcrypt.compareSync(
                body.password,
                user.password
            );

            if (!verifyPassword) {
                return done(null, false, {
                    message: "Correo Electrónico ó contranseña incorrecta.",
                });
            }
            return done(null, user);
        }
    );
}
