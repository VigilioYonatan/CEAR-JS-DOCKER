import cache from "@vigilio/express-core/cache";
import Logger from "./logger.js";

/**
 * @typedef {Object} CacheTimes
 * @property {number} minute - 1 minuto en segundos
 * @property {number} minutes10 - 10 minutos en segundos
 * @property {number} minutes30 - 30 minutos en segundos
 * @property {number} hour - 1 hora en segundos
 * @property {number} hours4 - 4 horas en segundos
 * @property {number} days1 - 1 día en segundos
 * @property {number} days3 - 3 días en segundos
 * @property {number} days7 - 7 días en segundos
 * @property {number} days30 - 30 días en segundos
 */

/**
 * Tiempos de cache predefinidos en segundos
 * @type {CacheTimes}
 * @example
 * // Tiempos disponibles:
 * // minute: 60 * 1,          // 1 minuto
 * // minutes10: 60 * 10,      // 10 minutos
 * // minutes30: 60 * 30,      // 30 minutos
 * // hour: 60 * 60,           // 1 hora
 * // hours4: 60 * 60 * 4,     // 4 horas
 * // days1: 60 * 60 * 24,     // 24 horas (1 día)
 * // days3: 60 * 60 * 24 * 3, // 3 días
 * // days7: 60 * 60 * 24 * 7, // 7 días
 * // days30: 60 * 60 * 24 * 30 // 30 días
 */
export const cacheTimes = {
    minute: 60 * 1, //1 minuto
    minutes10: 60 * 10, //10 minutos
    minutes30: 60 * 30, //30 minutos
    hour: 60 * 60, //1 hora
    hours4: 60 * 60 * 4, //4 horas
    days1: 60 * 60 * 24, //24 horas (1 día)
    days3: 60 * 60 * 24 * 3, //3 días
    days7: 60 * 60 * 24 * 7, //7 días
    days30: 60 * 60 * 24 * 30, //30 días
};

/**
 * Obtiene un valor del cache y lo parsea como JSON
 * @template T
 * @param {string} key - Clave del cache
 * @returns {T|null} Valor parseado o null si no existe o hay error
 */
export function cacheGetJson(key) {
    console.log(cache);
    const value = cache.get(key);
    if (!value) return null;
    Logger.info(`Cache get: ${key}`);

    try {
        return JSON.parse(value);
    } catch (_err) {
        return null;
    }
}
