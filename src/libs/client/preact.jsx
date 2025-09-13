/**
 * Configuration: Do not touch. If you have problems communicating with Vigilio in this part.
 */
import { render as renderPreact } from "preact";
import { Suspense } from "preact/compat";
import { TextProvider } from "../../contexts/useTestContext";

/**
 * Renders a Preact component with Suspense fallback into a DOM element
 * @param {Element} el - The DOM element to render into
 * @param {JSX.Element|JSX.Element[]} children - The Preact component(s) to render
 * @param {null|JSX.Element|JSX.Element[]} [fallback=null] - The fallback UI to show while loading
 * @returns {ReturnType<typeof renderPreact>} The render result
 */
function Provider(el, children, fallback = null) {
    return renderPreact(
        <TextProvider>
            <Suspense fallback={fallback}>{children}</Suspense>
        </TextProvider>,
        el
    );
}

/**
 * Renders a component into all DOM elements matching the formatted route path
 * @param {string} element - The route path to format and match
 * @param {Function} Component - The component function to render
 * @param {null|JSX.Element|JSX.Element[]} [fallback=null] - The fallback UI to show while loading
 */
export function render(element, Component, fallback = null) {
    /**
     * Formats a route path for DOM selector matching
     * @param {string} routePath - The route path to format
     * @returns {string} The formatted selector name
     */
    function formatPath(routePath) {
        let formatted = routePath.startsWith("/")
            ? routePath
                  .toLowerCase()
                  .replaceAll(".tsx", "")
                  .replaceAll(".jsx", "")
                  .slice(1)
            : routePath
                  .toLowerCase()
                  .replaceAll(".tsx", "")
                  .replaceAll(".jsx", "");

        if (formatted === "index") return "index";
        const segments = formatted.split("/");
        const processedSegments = segments.map((segment) => {
            if (segment.startsWith(":")) {
                return `[${segment.slice(1)}]`;
            }
            return segment;
        });
        formatted = processedSegments.join("-");
        if (!formatted.endsWith("]") && !formatted.endsWith("index")) {
            formatted += "-index";
        }
        return formatted;
    }

    const name = formatPath(element);

    /**
     * Escapes CSS selector special characters
     * @param {string} selector - The selector to escape
     * @returns {string} The escaped selector
     */
    function escapeSelector(selector) {
        return selector.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
    }

    const nameNumber = !Number.isNaN(Number(name[0]))
        ? `page-${name}`
        : name.startsWith("[")
        ? `page-${name.slice(1, -1)}-index`
        : name;

    const elements = document.querySelectorAll(escapeSelector(nameNumber));

    /** @type {Object} */
    let props = {};

    elements.forEach((el) => {
        if (el) {
            for (const [_key, value] of Object.entries(el?.attributes)) {
                const printValue = value.name.startsWith(":")
                    ? JSON.parse(value.value)
                    : value.value;
                const printName = value.name.startsWith(":")
                    ? value.name.slice(1)
                    : value.name;
                props = { ...props, [printName]: printValue };
            }
            Provider(el, <Component {...props} />, fallback);
        }
    });
}

/**
 * Creates a wrapper div and renders a React component inside it
 * @param {JSX.Element|JSX.Element[]} children - The component(s) to render
 * @param {null|JSX.Element|JSX.Element[]} [fallback=null] - The fallback UI to show while loading
 * @returns {HTMLElement} The wrapper div element containing the rendered component
 */
export function reactComponent(children, fallback = null) {
    /**
     * Creates a DOM element with specified tag and attributes
     * @param {string} tag - The HTML tag name
     * @param {Object} attributes - The attributes to set
     * @returns {HTMLElement} The created element
     */
    function c(tag, attributes) {
        const element = document.createElement(tag);
        Object.assign(element, attributes);
        return element;
    }

    const div = c("div", { className: "w-full text-start" });
    Provider(div, children, fallback);
    return div;
}
