/**
 * @typedef {Object} LoaderProps
 * @property {number} [width=20] - Ancho del loader en píxeles.
 * @property {number} [height=20] - Alto del loader en píxeles.
 * @property {string} [color="white"] - Color del borde del loader.
 */

/**
 * Loader animado tipo spinner.
 *
 * @param {LoaderProps} props
 * @returns {JSX.Element}
 */
function Loader({ width = 20, height = 20, color = "white" }) {
	return (
		<>
			<span className="loader" />
			<style jsx>{`
                .loader {
                    width: ${width}px;
                    height: ${height}px;
                    border: 5px solid ${color};
                    border-bottom-color: transparent;
                    border-radius: 50%;
                    display: inline-block;
                    box-sizing: border-box;
                    animation: rotation 1s linear infinite;
                }
                @keyframes rotation {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
		</>
	);
}

export default Loader;
