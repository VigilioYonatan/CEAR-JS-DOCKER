import SessionSequelize from "connect-session-sequelize";
import session from "express-session";
import passport from "passport";
import { sequelize } from "../../../config/server/db.config.js";
import enviroments from "../../../config/server/environments.config.js";
import { cacheTimes } from "../../../libs/server/helpers.js";

/**
 * Inicializa el autenticación con passport
 * @param {Express} app - Express app
 */
export async function initialAuth(app) {
    if (enviroments.NODE_ENV === "production") {
        app.set("trust proxy", 1);
    }

    // https://www.passportjs.org/concepts/authentication/sessions/
    const SequelizeStore = SessionSequelize(session.Store);
    // session
    const store = new SequelizeStore({
        db: sequelize,
        tableName: "sessions", // Opcional: nombre personalizado para la tabla
        checkExpirationInterval: cacheTimes.hour * 1000, // Limpiar sesiones expiradas cada 15 min
        expiration: cacheTimes.days3 * 1000, // Tiempo de expiración coherente con cookie
    });
    await store.sync();
    app.use(
        session({
            secret: enviroments.JWT_KEY,
            resave: false,
            saveUninitialized: false,
            rolling: true,
            proxy: enviroments.NODE_ENV === "production", // NODE_ENV === 'production'
            cookie: {
                secure: enviroments.NODE_ENV === "production", //true in production
                httpOnly: enviroments.NODE_ENV === "production",
                maxAge: cacheTimes.days3 * 1000, // 3 dias
            },
            store,
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    // strategies
    passport.use(localStrategy());
    passport.use(jwtStrategy());

    passport.serializeUser((user, done) => {
        return done(null, user);
    });
    passport.deserializeUser(async (user, done) => {
        const usuario = await usuarioShow(String(user.id));
        if (!usuario) {
            return done(null, null);
        }
        return done(null, usuario.usuario);
    });
}
