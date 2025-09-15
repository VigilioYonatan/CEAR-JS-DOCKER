import { ChevronDownIconLight } from "@vigilio/react-icons";
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { cn } from "../../libs/client/helpers";
import { anidarPropiedades } from ".";
import { FormControlContext } from "./Form";

/**
 * FormSelect Component
 * A custom dropdown/select input component for forms, using React and `react-hook-form`.
 * Allows users to select from a list of options, with validation and error handling.
 *
 * @param {Object} props - The props for the component
 * @param {string} props.title - The title of the select field
 * @param {string} props.name - The name of the select field, used in the form
 * @param {JSX.Element|string} [props.question] - Optional helper question text to display with a tooltip
 * @param {Object} [props.options] - Optional validation options passed to `react-hook-form`
 * @param {string} props.placeholder - Placeholder text when no option is selected
 * @param {JSX.Element} [props.ico] - Optional icon to display inside the select input
 * @param {boolean} [props.isLoading] - Indicates if the field is in a loading state
 * @param {Array} props.array - The list of options for the select field, each option should have a `value` and `key`
 * @param {string} [props.className] - Optional custom class names for styling
 * @param {boolean} [props.disabled] - Whether the select field is disabled
 * @param {boolean} [props.required] - Whether the field is required
 *
 * @returns {JSX.Element} The rendered FormSelect component
 */
function FormSelect({
	name,
	title,
	question,
	options = {},
	array,
	placeholder,
	isLoading = false,
	ico,
	className,
	disabled,
	...rest
}) {
	const {
		register,
		setValue,
		getValues,
		formState: { errors },
	} = useContext(FormControlContext);

	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState(null);
	const selectRef = useRef(null);
	const [isFocused, setIsFocused] = useState(false);

	// Retrieve and handle error messages
	const err = anidarPropiedades(errors, name.split("."));

	// Initialize selected option when the component mounts or options change
	useEffect(() => {
		const currentValue = getValues(name);
		if (currentValue) {
			const option = array.find((item) => item.key === currentValue);
			if (option) setSelectedOption(option);
		}
	}, [array, getValues, name]);

	// Close the dropdown if clicking outside the select
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (selectRef.current && !selectRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Handle option selection
	const handleSelect = (option) => {
		setSelectedOption(option);
		setValue(name, option.key, {
			shouldValidate: true,
		});
		setIsOpen(false);
	};

	return (
		<div className="space-y-2 w-full" ref={selectRef} {...rest}>
			{title && (
				<label
					htmlFor={name}
					className="block text-sm font-medium text-foreground !text-secondary-dark capitalize"
				>
					{title}
					{rest.required && <span className="text-primary">*</span>}
				</label>
			)}

			<div className="relative">
				{/* Input trigger */}
				{/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
				<div
					className={cn(
						"w-full py-2 border border-input rounded-lg text-foreground",
						disabled ? "bg-muted/30 cursor-not-allowed" : "bg-background",
						"focus:outline-none focus:ring-2 focus:ring-primary focus:border-ring/30",
						"transition-all duration-200 cursor-pointer",
						isFocused && "bg-accent/50",
						!!Object.keys(err).length &&
							"!border-destructive !focus:ring-destructive/20 !focus:border-destructive",
						isLoading && "opacity-50 cursor-not-allowed bg-muted/30",
						ico ? "pl-10 pr-2" : "px-4",
						className,
					)}
					onClick={() => !isLoading && setIsOpen(!isOpen)}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
				>
					{ico && (
						<div
							className={cn(
								"absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-muted-foreground rounded-l-lg bg-primary z-1 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:fill-white",
							)}
						>
							{ico}
						</div>
					)}

					<div
						className={`flex justify-between items-center py-0.5 ${
							ico ? "pl-4" : ""
						}`}
					>
						<span
							className={cn(
								"text-sm line-clamp-1 !text-start",
								selectedOption ? "" : "text-muted-foreground",
							)}
						>
							{selectedOption ? selectedOption.value : placeholder}
						</span>

						<ChevronDownIconLight
							className={cn(
								"w-3 h-3 transition-transform duration-200",
								isOpen && !disabled ? "rotate-180" : "",
							)}
						/>
					</div>
				</div>

				{/* Dropdown menu */}
				{isOpen && !disabled && (
					<div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-lg shadow-lg max-h-60 overflow-auto">
						{/* Options list */}
						{array.length > 0 ? (
							<ul>
								{array.map((option) => (
									<li
										key={String(option.key)}
										className={`px-4 py-2 cursor-pointer ${
											selectedOption?.key === option.key
												? "bg-primary text-white"
												: "hover:text-primary"
										}`}
										onClick={() => handleSelect(option)}
									>
										{option.value}
									</li>
								))}
							</ul>
						) : (
							<div className="px-4 py-2 text-muted-foreground text-sm">
								No se encontraron resultados
							</div>
						)}
					</div>
				)}

				{question && (
					<div className="absolute right-10 top-1/2 -translate-y-1/2 group">
						<i className="fa-solid fa-circle-question text-xs text-muted-foreground" />
						<div className="text-xs min-w-[100px] hidden group-hover:block -top-[35px] right-1 p-1 shadow text-center absolute rounded-md bg-background text-foreground z-10 font-semibold">
							{question}
						</div>
					</div>
				)}

				{/* Hidden input for form registration */}
				<input type="hidden" {...register(name, options)} />
			</div>

			{isLoading && (
				<div className="w-full h-[2px] relative overflow-hidden">
					<div className="absolute top-0 left-0 h-full w-full bg-primary/20">
						<div className="absolute h-full bg-primary animate-[loading_2s_infinite] w-full" />
					</div>
				</div>
			)}

			{Object.keys(err).length ? (
				<p className="text-sm text-destructive flex items-center gap-1">
					<span className="w-1 h-1 bg-destructive rounded-full" />
					{err?.message}
				</p>
			) : null}
		</div>
	);
}

/**
 * Converts a string to a number, returns null if the value is not greater than 0.
 *
 * @param {string} value - The value to convert
 * @returns {number|null} The converted number or null
 */
export function formSelectNumber(value) {
	return Number(value) > 0 ? Number(value) : null;
}

export default FormSelect;
