import { safeParseAsync } from "@vigilio/valibot/dist/cjs/methods/safeParse/index.js";

// validar el body con valibot req.body
export function ValidatorValibot(schema) {
    return async (req, res, next) => {
        const schemaConverter =
            typeof schema === "function" ? schema(req, res) : schema;
        const data = await safeParseAsync(schemaConverter, req.body);
        if (!data.success) {
            let message = null;
            try {
                message = Array.isArray(JSON.parse(data.issues[0].message))
                    ? req.t(...JSON.parse(data.issues[0].message))
                    : data.issues[0].message;
            } catch (_) {
                message = data.issues[0].message;
            }
            return res.status(400).json({
                success: false,
                message,
                body: data.issues[0].path
                    ? data.issues[0].path[0].key
                    : data.issues[0].validation,
            });
        }
        req.body = data.data;
        next();
    };
}
