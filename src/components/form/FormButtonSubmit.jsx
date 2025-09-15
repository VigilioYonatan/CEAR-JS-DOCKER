import Loader from "../extras/Loader";

/**
 * Props para el botón de envío del formulario.
 *
 * @typedef {Object} FormButtonSubmitProps
 * @property {boolean} isLoading - Indica si el formulario está en estado de carga.
 * @property {string} loading_title - Texto que se muestra mientras carga.
 * @property {string} title - Texto que se muestra normalmente.
 * @property {string} [className] - Clases CSS adicionales para el botón.
 * @property {JSX.Element | JSX.Element[] | null} [ico] - Ícono opcional para mostrar en el botón.
 * @property {boolean} [disabled=false] - Deshabilita el botón si es true.
 */

/**
 * Botón de envío para formularios con estado de carga.
 *
 * @param {FormButtonSubmitProps} props
 * @returns {JSX.Element}
 */
function FormButtonSubmit({
	isLoading,
	title,
	className = "",
	loading_title,
	disabled = false,
	ico,
}) {
	return (
		<button
			type="submit"
			className={`${className} text-xs bg-primary py-3 px-8 font-bold rounded-md text-white tracking-wider mx-auto uppercase mt-3 flex items-center gap-2 text-justify`}
			disabled={disabled}
		>
			{isLoading ? (
				<>
					<Loader /> {loading_title}
				</>
			) : (
				<>
					{ico || null}
					{title}
				</>
			)}
		</button>
	);
}

export default FormButtonSubmit;
