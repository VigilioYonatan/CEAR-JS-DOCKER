import path from "node:path";
import { fileURLToPath } from "node:url";
import enviroments from "./environments.config.js";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const dirMode =
    enviroments.NODE_ENV === "production"
        ? path.resolve(__dirname, "..", "..", "..", "..")
        : path.resolve(__dirname, "..", "..", "..");

export const BASE_URL = () => enviroments.VITE_URL;

export const IP_CEAR = "170.0.234.103";
export const academicNumero = "986605219";
export const academicEmail = "area-academico@cearlatinoamericano.edu.pe";
