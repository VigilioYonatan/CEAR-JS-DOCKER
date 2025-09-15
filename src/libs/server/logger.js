import fs from "node:fs";
import path from "node:path";
import pino from "pino";
import pretty from "pino-pretty";
import enviroments from "../../config/server/environments.config.js";

const isDev = enviroments.NODE_ENV === "development";
const logLevel = isDev ? "debug" : "warn";

const logDir = "./logs";
const logFile = path.join(logDir, "error.log");

// Crear la carpeta si no existe
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir, { recursive: true });
}

// Crear el archivo si no existe
if (!fs.existsSync(logFile)) {
	fs.writeFileSync(logFile, "", "utf8"); // crea un archivo vacío
}
// Streams para multistream (múltiples destinos)
const streams = [];

// Stream principal: pretty en dev o stdout JSON en prod
streams.push({
	level: logLevel,
	stream: isDev
		? pretty({
				colorize: true,
				translateTime: "yyyy-mm-dd HH:MM:ss",
				ignore: "pid,hostname",
			})
		: pino.destination(1),
});

// Stream exclusivo para errores a archivo
streams.push({
	level: "error",
	stream: pino.destination(logFile),
});

const Logger = pino(
	{
		level: logLevel,
		base: undefined,
		timestamp: () =>
			`,"time":"${new Date().toLocaleString("es-PE", {
				timeZone: "America/Lima",
				hour12: false,
			})}"`,
		formatters: {
			level(label) {
				return { level: label };
			},
		},
		customLevels: {
			http: 25,
		},
	},
	pino.multistream(streams),
);

// process.on("uncaughtException", (err) => {
//     Logger.error({ err }, "Uncaught Exception");
// });
// process.on("unhandledRejection", (reason) => {
//     Logger.error({ reason }, "Unhandled Rejection");
// });

export default Logger;
