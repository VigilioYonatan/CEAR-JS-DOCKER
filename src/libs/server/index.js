import { safeParse } from "@vigilio/valibot";

// validar el body con valibot req.body
export function ValidatorValibot(schema) {
    return async (req, res, next) => {
        console.log({ body: req.body });

        const schemaConverter =
            typeof schema === "function" ? schema(req, res) : schema;
        const data = await safeParse(schemaConverter, req.body);
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
        console.log({ data });
        req.body = data.output;
        next();
    };
}
