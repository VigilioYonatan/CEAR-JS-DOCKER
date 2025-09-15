import { useEffect, useRef, useState } from "preact/hooks";

function useDropdown(isHover = false) {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const trigger = useRef(null);
	const dropdown = useRef(null);

	function onClose(time = 0) {
		setTimeout(() => {
			setDropdownOpen(false);
		}, time * 1000);
	}

	function onOpen() {
		setDropdownOpen(true);
	}

	function onOpenClose() {
		setDropdownOpen((prev) => !prev);
	}

	// close on click outside
	useEffect(() => {
		const clickHandler = ({ target }) => {
			if (!dropdown.current) return;
			if (
				!dropdownOpen ||
				dropdown.current.contains(target) ||
				trigger.current?.contains(target)
			) {
				return;
			}
			setDropdownOpen(false);
		};

		document.addEventListener("click", clickHandler);
		return () => document.removeEventListener("click", clickHandler);
	}, [dropdownOpen]);

	useEffect(() => {
		const mouseMoveHandler = ({ target }) => {
			if (!dropdown.current) return;
			if (
				!dropdownOpen ||
				dropdown.current.contains(target) ||
				trigger.current?.contains(target)
			) {
				return;
			}
			setDropdownOpen(false);
		};

		if (isHover) {
			document.addEventListener("mousemove", mouseMoveHandler);
			return () => document.removeEventListener("mousemove", mouseMoveHandler);
		}
	}, [dropdownOpen, isHover]);

	// close if the esc key is pressed
	useEffect(() => {
		const keyHandler = ({ key }) => {
			if (!dropdownOpen || key !== "Escape") return;
			setDropdownOpen(false);
		};

		document.addEventListener("keydown", keyHandler);
		return () => document.removeEventListener("keydown", keyHandler);
	}, [dropdownOpen]);

	return {
		dropdownOpen,
		trigger,
		dropdown,
		onClose,
		onOpen,
		onOpenClose,
	};
}

export default useDropdown;
