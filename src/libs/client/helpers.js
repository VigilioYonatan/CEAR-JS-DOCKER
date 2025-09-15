/**
 * @template T
 * @param {import("react-hook-form").UseFormReturn<T>} form
 * @param {keyof T} key
 * @returns {Promise<void>}
 */
export async function onPageImage(form, key) {
	const text = await navigator.clipboard.readText();
	if (!text.startsWith("http")) {
		sweetAlert({
			icon: "info",
			title:
				"Buscar y copiar <i class='far fa-copy'></i> imagen en  <i class='fas fa-cogs'></i>",
		});
		return;
	}
	try {
		const response = await fetch(`/proxy-image?url=${text}`);
		const blob = await response.blob();
		const file = new File([blob], text, { type: "image/webp" });
		form.setValue(/** @type {any} */ (key), [
			...(form.watch(/** @type {any} */ (key)) ?? []),
			file,
		]);
	} catch {
		alert("Error imagen");
	}
}

/**
 * @param {number} total
 * @returns {string}
 */
export function formatSoles(total) {
	return `S/ ${total}`;
}

/**
 * @param {"open"} key
 */
export function removeValueQuery(key) {
	const url = new URL(window.location.href);
	url.searchParams.delete(key);
	window.history.replaceState({}, document.title, url.toString());
}

/**
 * @param {string} key
 * @param {string} value
 */
export function setValueQuery(key, value) {
	const url = new URL(window.location.href);
	url.searchParams.set(key, value);
	window.history.replaceState({}, document.title, url);
}

/**
 * @param {string} key
 * @returns {string | null}
 */
export function getQuery(key) {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	return urlParams.get(key);
}

/**
 * @returns {boolean}
 */
export function downloadPDF() {
	return useMediaQuery("(max-width: 600px)");
}

/**
 * @param {string} email
 * @returns {string}
 */
export function ocultarEmail(email) {
	if (!email.includes("@")) return email;

	const [nombre, dominio] = email.split("@");
	const visibles = 2;
	const ocultos = "*".repeat(Math.max(0, nombre.length - visibles));

	return `${nombre.slice(0, visibles)}${ocultos}@${dominio}`;
}

/**
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
	if (typeof str !== "string" || !str.length) return str;
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * @param {string} texto
 * @returns {string}
 */
export function normalizarText(texto) {
	return texto
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase();
}

/**
 * @param {string} telephone
 * @returns {string}
 */
export function formatTelephoneNumber(telephone) {
	return telephone.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
}

/**
 * Clase utilitaria para unir clases condicionales.
 * @param  {...(string | undefined | null | boolean)} classes
 * @returns {string}
 */
export function cn(...classes) {
	return classes.filter(Boolean).join(" ");
}

/**
 * @param {string} str
 * @returns {string}
 */
export function normalizeString(str) {
	return str
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.trim();
}

/**
 * @template T
 * @param {import("react-hook-form").UseFormReturn<T>} form
 * @param {{ success: boolean; body: keyof T; message: string }} error
 * @param {string} message
 */
export function handlerError(form, error, message) {
	if (error?.body) {
		form.setError(error.body, { message: error.message });
		form.resetField(error.body, { keepError: true });
		return;
	}

	sweetModal({
		icon: "danger",
		title: message,
		text: `${error.message}`,
	});
}

/**
 * Tamaños predefinidos para íconos.
 * @type {Record<"small" | "medium" | "large" | "xlarge", {
 *   width: number;
 *   height: number;
 *   minWidth: number;
 *   maxWidth: number;
 *   minHeight: number;
 *   maxHeight: number;
 * }>}
 */
export const sizeIcon = {
	small: {
		width: 16,
		height: 16,
		minWidth: 16,
		maxWidth: 16,
		minHeight: 16,
		maxHeight: 16,
	},
	medium: {
		width: 20,
		height: 20,
		minWidth: 20,
		maxWidth: 20,
		minHeight: 20,
		maxHeight: 20,
	},
	large: {
		width: 24,
		height: 24,
		minWidth: 24,
		maxWidth: 24,
		minHeight: 24,
		maxHeight: 24,
	},
	xlarge: {
		width: 32,
		height: 32,
		minWidth: 32,
		maxWidth: 32,
		minHeight: 32,
		maxHeight: 32,
	},
};

/**
 * Clase de animación de fadeIn en Tailwind
 * @type {string}
 */
export const animationFadeInTailwind =
	"animate-[fadeIn_0.5s_ease-in-out_forwards]";
