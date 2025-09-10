/**
 * @file Module for generating HTML head and meta tags, styles, and server-side rendering utilities.
 * @module serverRenderUtils
 */

import { BASE_URL } from "../../../config/server/const.js";
import enviroments from "../../../config/server/environments.config.js";

/**
 * Interface for header properties
 * @interface HeaderProps
 * @property {string} title - The page title
 * @property {string} [description] - The page description
 */

/**
 * Generates HTML meta tags for SEO and social media sharing
 * @async
 * @function Header
 * @param {HeaderProps} props - Header configuration properties
 * @returns {Promise<string>} HTML string containing meta tags
 */
export async function Header({
    title,
    description = "Centro de Arbitraje e Investigaciones Jurídicas. Especialistas en arbitraje con contrataciones públicas, arbitrajes de emergencias y Junta de Resolución de disputas.",
}) {
    const logo = `${BASE_URL()}/images/favicon.webp`;

    const seo = {
        title,
        description,
        keywords:
            "arbitraje, arbitraje en contrataciones públicas, arbitraje con el estado, arbitraje de emergencia, normativa contratación pública Perú, disputas contractuales, resolución de controversias, junta de resolución de disputas, dispute boards",
    };

    return `
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${seo.title}</title>
        <meta name="description" content="${seo.description}">
        <meta name="keywords" content="${seo.keywords}">
        <meta itemprop="name" content="cearlatinoamericano">
        <meta itemprop="description" content="${seo.description}">
        <meta itemprop="image" content="${logo}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="${BASE_URL()}">
        <meta name="twitter:title" content="${seo.title}">
        <meta name="twitter:description" content="${seo.description}">
        <meta name="twitter:creator" content="cearlatinoamericano">
        <meta name="twitter:image" content="${logo}">
        <meta property="og:title" content="${seo.title}">
        <meta property="og:type" content="website">
        <meta property="og:url" content="${logo}">
        <meta property="og:image" content="${logo}">
        <meta property="og:width" content="800">
        <meta property="og:height" content="800">
        <meta property="og:description" content="${seo.description}">
        <meta property="og:site_name" content="cearlatinoamericano">
        <meta name="fb:app_id" content="100064161184422">
        <link rel="apple-touch-icon" href="${logo}">
        <link rel="manifest" href="${enviroments.VITE_URL}/manifest.json">
        <link rel="icon" href="/images/settings/favicon.ico" type="image/x-icon">
        `;
}

/**
 * Generates Tailwind CSS styles with custom primary color
 * @function tailwind
 * @param {string} color_primary - The primary color to use in the theme
 * @returns {string} CSS style tag with Tailwind variables
 */
export function tailwind(color_primary) {
    return `
     <!-- los primarios son --primary y --primary-foreground -->
        <!-- accent y accent-foreground -->
        <style type="text/css">
            @layer base {
                :root {
                    /* Light theme - HEX colors */
                    --background: #ffffff;
                    --foreground: #0a0a0a;
                    --card: #ffffff;
                    --card-foreground: #0a0a0a;
                    --popover: #ffffff;
                    --popover-foreground: #0a0a0a;
                    --primary: ${color_primary};
                    --primary-foreground: ${color_primary};
                    --secondary: #f5f5f5;
                    --secondary-foreground: #0b95ba;
                    --muted: #f5f5f5;
                    --muted-foreground: #737373;
                    --accent: #f5f5f5;
                    --accent-foreground: #0b95ba;
                    --destructive: #dc2626;
                    --destructive-foreground: #fafafa;
                    --border: #e5e5e5;
                    --input: #e5e5e5;
                    --ring: #171717;
                    --radius: 0.5rem;
                }
                .dark {
                    /* Dark theme - HEX colors */
                    --background: #0a0a0a;
                    --foreground: #fafafa;
                    --card: #0a0a0a;
                    --card-foreground: #fafafa;
                    --popover: #0a0a0a;
                    --popover-foreground: #fafafa;
                    --primary: ${color_primary};
                    --primary-foreground: ${color_primary};
                    --secondary: #262626;
                    --secondary-foreground: #0b95ba;
                    --muted: #262626;
                    --muted-foreground: #a3a3a3;
                    --accent: #262626;
                    --accent-foreground: #0b95ba;
                    --destructive: #7f1d1d;
                    --destructive-foreground: #fafafa;
                    --border: #262626;
                    --input: #262626;
                    --ring: #d4d4d4;
                }

                * {
                    border-color: var(--border);
                }

                body {
                    color: var(--foreground);
                    font-feature-settings: "rlig" 1, "calt" 1;
                }
            }
        </style>
    `;
}
/**
 * Escapa las comillas dobles en un string, reemplazándolas con `\"`.
 *
 * @param {string} str - El string que contiene comillas dobles.
 * @returns {string} El string con las comillas dobles escapadas.
 */
export function escapeQuotes(str) {
    return str.replace(/"/g, '\\"');
}

/**
 * Escapa un JSON para que sea seguro como atributo HTML.
 * Reemplaza caracteres especiales como `"`, `'`, `<`, `>`.
 *
 * @param {string} json - El JSON en formato string.
 * @returns {string} El string escapado para usar como atributo HTML.
 */
export function escapeForHtmlAttribute(json) {
    return json
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

/**
 * Convierte un objeto de propiedades en un string con formato de atributos HTML.
 *
 * @param {Record<string, unknown>} props - Objeto con las propiedades a convertir.
 * @returns {string} Un string con las propiedades formateadas como atributos HTML.
 */
export function propsToString(props) {
    return Object.entries(props)
        .map(([key, value]) => {
            if (typeof value === "string") {
                return `${key}="${escapeQuotes(value)}"`; // escape de comillas
            }
            return `:${key}="${escapeForHtmlAttribute(JSON.stringify(value))}"`;
        })
        .join(" ");
}

/**
 * Crea un middleware que renderiza una página HTML dinámica.
 *
 * @param {Object} props - Configuración para el renderizado.
 * @param {string} [props.lang] - Idioma de la página (por defecto `es`).
 * @param {string} [props.head] - Contenido adicional para el `<head>`.
 * @param {string} [props.scripts] - Scripts adicionales para la página.
 * @param {Record<string, unknown>} [props.props] - Propiedades adicionales que se inyectan en `window.props`.
 * @returns {(req: RequestCEAR, res: Response) => Promise<void>} Middleware Express-like que renderiza la respuesta HTML.
 */
export function render(props) {
    return async (req, res) => {
        /**
         * Formatea la ruta para generar el nombre del componente.
         *
         * @param {string} routePath - Ruta original de Express.
         * @returns {string} Nombre formateado del componente a renderizar.
         */
        function formatPath(routePath) {
            let formatted = routePath.startsWith("/")
                ? routePath.slice(1)
                : routePath;

            formatted = !Number.isNaN(Number(formatted[0]))
                ? `page-${formatted.replace("*", "")}`
                : formatted.startsWith(":")
                ? `page-${formatted.slice(1).replace("*", "")}`
                : formatted.replace("*", "");

            if (formatted === "") return "index";
            const segments = formatted.split("/");
            const processedSegments = segments.map((segment) => {
                if (segment.startsWith(":")) {
                    return `[${segment.slice(1)}]`;
                }
                return segment;
            });
            formatted = processedSegments.join("-");
            if (!formatted.endsWith("]")) {
                formatted += "-index";
            }
            return formatted;
        }

        let pathJs = formatPath(req.route.path.toLowerCase());
        pathJs = pathJs === "admin*-index" ? "app-index" : pathJs;

        // Carga global para mejor performance
        props.props = {
            ...(props.props || {}),
            clase_types: req.clase_types,
            actividades_types: req.actividades_types,
            empresa: req.empresa,
            novedad_categories: req.novedad_categories,
            novedad_types: req.novedad_types,
            novedad: req.novedad,
            usuario: req.user,
            curso_types: req.curso_types,
        };

        return res.send(`
            <!DOCTYPE html>
            <html lang="${props.lang || "es"}">
                <head>
                    ${props.head || ""}
                    ${tailwind("#000000")}
                    ${res.locals.vite}
                </head>
                <body class="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 ">
                    <${pathJs}></${pathJs}>
                    <script>window.props = ${JSON.stringify(
                        props.props || {}
                    )};</script>
                </body>
            </html>`);
    };
}
