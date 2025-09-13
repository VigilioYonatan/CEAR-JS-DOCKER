import { useEffect, useState } from "preact/hooks";

/**
 * Hook que detecta si un media query es verdadero o falso (reactivo).
 *
 * @param {string} query - El media query CSS (por ejemplo: "(min-width: 768px)").
 * @returns {boolean} Verdadero si coincide el media query.
 */
function useMediaQuery(query) {
    const getMatches = (query) => {
        if (typeof window !== "undefined") {
            return window.matchMedia(query).matches;
        }
        return false;
    };

    const [matches, setMatches] = useState(getMatches(query));

    function handleChange() {
        setMatches(getMatches(query));
    }

    useEffect(() => {
        const matchMedia = window.matchMedia(query);

        handleChange(); // Ejecutar al montar

        if (matchMedia.addListener) {
            matchMedia.addListener(handleChange);
        } else {
            matchMedia.addEventListener("change", handleChange);
        }

        return () => {
            if (matchMedia.removeListener) {
                matchMedia.removeListener(handleChange);
            } else {
                matchMedia.removeEventListener("change", handleChange);
            }
        };
    }, [query]);

    return matches;
}

/**
 * @typedef {Object} UseMediaProps
 * @property {string|number} mobile
 * @property {string|number} minitablet
 * @property {string|number} tablet
 * @property {string|number} laptop
 * @property {string|number} custom
 */

/**
 * Hook que devuelve un valor personalizado según el tamaño de pantalla actual.
 *
 * @param {UseMediaProps} props
 * @returns {string|number}
 */
export function useMedia(props) {
    const mobile = useMediaQuery("(min-width: 400px)");
    const minitablet = useMediaQuery("(min-width: 550px)");
    const tablet = useMediaQuery("(min-width: 750px)");
    const laptop = useMediaQuery("(min-width: 1150px)");

    return laptop
        ? props.laptop
        : tablet
        ? props.tablet
        : minitablet
        ? props.minitablet
        : mobile
        ? props.mobile
        : props.custom;
}

/**
 * Hook no reactivo para verificar si un media query coincide.
 *
 * @param {string} query
 * @returns {boolean}
 */
export function useMediaQueryNoReactive(query) {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
}

export default useMediaQuery;
