import {
    BaseError,
    ConnectionError,
    ConnectionRefusedError,
    DatabaseError,
    ExclusionConstraintError,
    ForeignKeyConstraintError,
    TimeoutError,
    UniqueConstraintError,
    ValidationError,
} from "sequelize";
import { cacheGetJson } from "./helpers.js";
import Logger from "./logger.js";
import cache from "@vigilio/express-core/cache";

function buildResponse(err, message, body = {}) {
    return {
        success: false,
        message,
        body,
        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack,
            details: err.errors,
        }),
    };
}
/**
 * Middleware que maneja las rutas de la aplicación.
 * @param {Request} req - La solicitud HTTP.
 * @param {Response} res - La respuesta HTTP.
 * @returns {Promise<void>} - La promesa que resuelve la función.
 */
export async function middlewareRoute(req, res) {
    // Log the error with fallback values
    Logger.error(`Error en la aplicación: ${req.path}`, {
        error: "Unknown error",
        stack: "No stack trace available",
        path: req.path,
        method: req.method,
    });
    Logger.error(`Error en la aplicación: ${req.path}`);
    if (req.path.includes("/api")) {
        return res.status(404).json({
            error: 404,
            success: false,
            message: "This endpoint is not correct",
        });
    }
    res.redirect("/404");
}

/**
 * Middleware que maneja los errores de la aplicación.
 * @param {any} err - El error.
 * @param {Request} req - La solicitud HTTP.
 * @param {Response} res - La respuesta HTTP.
 * @param {NextFunction} _ - La función siguiente.
 */
export function errorHandlerMiddleware(err, req, res, _) {
    if (err instanceof UniqueConstraintError) {
        const e = err.errors?.[0] || {};
        return res
            .status(400)
            .json(
                buildResponse(err, `${e.value || "unknown"} ya existe.`, e.path)
            );
    }

    if (err instanceof ValidationError) {
        const errors =
            err.errors?.map((e) => ({
                field: e.path,
                message: e.message,
                value: e.value,
                validator: e.validatorKey,
            })) ?? [];
        return res.status(400).json(
            buildResponse(err, "Error de validación en los datos", {
                errors,
            })
        );
    }

    if (err instanceof ForeignKeyConstraintError)
        return res.status(400).json(
            buildResponse(
                err,
                "Esto ya tiene elementos relacionados, eliminalos primero.",
                {
                    table: err.table,
                    fields: err.fields,
                    errorType: "FOREIGN_KEY_CONSTRAINT",
                }
            )
        );

    if (err instanceof ConnectionError || err instanceof ConnectionRefusedError)
        return res.status(503).json(
            buildResponse(err, "Error de conexión con la base de datos", {
                errorType: "DATABASE_CONNECTION_ERROR",
            })
        );

    if (err instanceof TimeoutError)
        return res.status(504).json(
            buildResponse(err, "Timeout en la operación de base de datos", {
                errorType: "DATABASE_TIMEOUT",
            })
        );

    if (err instanceof DatabaseError)
        return res.status(500).json(
            buildResponse(err, "Error interno de base de datos", {
                originalError: err.original?.message,
                sql: err.sql,
                errorType: "DATABASE_ERROR",
            })
        );

    if (err instanceof ExclusionConstraintError)
        return res.status(400).json(
            buildResponse(err, "Violación de constraint de exclusión", {
                constraint: err.constraint,
                table: err.table,
                errorType: "EXCLUSION_CONSTRAINT",
            })
        );

    if (err instanceof TypeError)
        return res.status(400).json(
            buildResponse(err, "Tipo de dato incorrecto", {
                body: err.name,
            })
        );

    if (err instanceof BaseError)
        return res.status(500).json(
            buildResponse(err, "Error inesperado de base de datos", {
                name: err.name,
                message: err.message,
                errorType: "SEQUELIZE_ERROR",
            })
        );

    Logger.error("Error global:", {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        statusCode: err.statusCode || 500,
    });

    return res
        .status(err.status || 500)
        .json(
            buildResponse(
                err,
                err.errors?.[0]?.message ||
                    err.message ||
                    "Error interno del servidor"
            )
        );
}

/**
 * Middleware que maneja el cache inicial de la aplicación.
 * @param {Request} req - La solicitud HTTP.
 * @param {Response} res - La respuesta HTTP.
 * @param {NextFunction} next - La función siguiente.
 */
export async function middlewareInitialCache(_, _2, next) {
    // const empresa = cacheGetJson("empresa"); // obtener
    // if (!empresa) {
    //     // empresa = await Empresa.findByPk(1); // ejemplo variabnle global que puede ir a toda la aplicacion
    //     // cache.set("empresa", empresa); // cachear para no consumir recursos a cada rato
    //     //  cachetimes 	cache.set("empresa", empresa, cacheTimes.days1);
    //     cache.set("empresa", { id: 1, name: "empresa" }, cacheTimes.days1);
    // }
    // res.empresa = empresa; // enviar a la respuesta y se puede obtener en el controlador
    next();
}
