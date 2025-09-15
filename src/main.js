import enviroments from "./config/server/environments.config.js";
import express from "express";
import morgan from "morgan";
import { client } from "@vigilio/express-core/client";
import { connectDB } from "./config/server/db.config.js";
import {
    errorHandlerMiddleware,
    middlewareInitialCache,
    middlewareRoute,
} from "./libs/server/middleware-route.js";
import { dirMode } from "./config/server/const.js";
import userRouter from "./services/user/controllers/user.controller.js";
import webRouter from "./services/web/controllers/web.controller.js";
import compression from "compression";
import Logger from "./libs/server/logger.js";
import helmet from "helmet";
import { initialAuth } from "./services/auth/libs/index.js";

const app = express();

// middleware de express para comprimir las respuestas
app.use(
    compression({
        threshold: 10000,
        filter: (req, res) => {
            if (req.headers["x-no-compression"]) {
                return false;
            }
            return compression.filter(req, res);
        },
    })
);
// middleware de express para proteger la aplicación
app.use(
    helmet({
        contentSecurityPolicy: {
            // Configura aunque sea una política básica
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    `http://localhost:${enviroments.VITE_PORT}`, // Permite scripts desde Vite (dev)
                    "'unsafe-inline'", // Necesario para Vite en desarrollo
                    "'unsafe-eval'", // Necesario para HMR (Hot Module Replacement)
                    "https://www.google.com", // Allow Google domains
                    "https://www.gstatic.com",
                    "https://cearlatinoamericano.pe", // Permitir TinyMCE
                ],
                connectSrc: [
                    "'self'",
                    `http://localhost:${enviroments.VITE_PORT}`, // Permite conexiones a Vite (websockets)
                    `ws://localhost:${enviroments.VITE_PORT}`, // WebSockets para HMR
                    "https://cearlatinoamericano.pe",
                    "wss://cearlatinoamericano.pe",
                    "https://pokeapi.co", //POKE API
                ],
                frameSrc: [
                    "'self'",
                    "https://www.google.com", // Required for reCAPTCHA
                    "https://www.recaptcha.net", // Alternative domain
                    "https://www.youtube.com",
                ],
                imgSrc: [
                    "'self'",
                    "data:",
                    "blob:",
                    "https://cearlatinoamericano.edu.pe",
                    "https://cearlatinoamericano.pe",
                    "https://raw.githubusercontent.com", //POKE API
                ],
                mediaSrc: ["'self'", "data:", "blob:"],

                // Añade más según necesites
            },
        },
        dnsPrefetchControl: true,
        frameguard: { action: "deny" },
        hidePoweredBy: true,
        hsts: { maxAge: 31536000, includeSubDomains: true }, // Solo si usas HTTPS
        ieNoOpen: true,
        noSniff: true,
        // Considera añadir:
        referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    })
);

// middleware de express para parsear el body de las peticiones
app.use(express.json());
app.use(express.static("public")); // middleware de express para servir archivos estáticos
app.use("/tinymce", express.static(`${dirMode}/node_modules/@vigilio/tinymce`));
// middleware de client para correr react en el servidor
app.use(client({ file: "pages/main.jsx" }));

// conectar a la base de datos
await connectDB();
// middleware de logging
app.use(
    morgan(enviroments.NODE_ENV === "development" ? "dev" : "combined", {
        stream: {
            write: (message) => {
                Logger.http(message.trim());
            },
        },
    })
);
initialAuth(app);
app.use(middlewareInitialCache);

// rutas
app.use("/", webRouter);
app.use("/api/user", userRouter);

// middleware de rutas y handler de errores
app.use(middlewareRoute);
app.use(errorHandlerMiddleware);

// iniciar el servidor
app.listen(enviroments.PORT, () => {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log(
        `Server is running on port ${enviroments.PORT} - ${enviroments.NODE_ENV}`
    );
});
