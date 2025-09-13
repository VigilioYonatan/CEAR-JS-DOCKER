import { ChevronDownIconLight, QuestionIconLight } from "@vigilio/react-icons";
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { sizeIcon } from "../../libs/client/helpers";
import Card from "../extras/card";
import { anidarPropiedades } from ".";
import { FormControlContext } from "./Form";

const DEFAULT_COLORS = [
    "#FF5252",
    "#FF4081",
    "#E040FB",
    "#7C4DFF",
    "#536DFE",
    "#448AFF",
    "#40C4FF",
    "#18FFFF",
    "#64FFDA",
    "#69F0AE",
    "#B2FF59",
    "#EEFF41",
    "#FFFF00",
    "#FFD740",
    "#FFAB40",
    "#FF6E40",
    "#000000",
    "#525252",
    "#969696",
    "#FFFFFF",
];

export default function FormColor({
    title,
    name,
    question,
    options = {},
    presetColors = DEFAULT_COLORS,
    popupPosition = "bottom",
    placeholder = "Elige un color",
    required = false,
}) {
    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = useContext(FormControlContext);

    const [isOpen, setIsOpen] = useState(false);
    const [customColor, setCustomColor] = useState("#000000");
    const [mode, setMode] = useState("palette"); // "palette" | "picker"
    const popupRef = useRef(null);

    const currentValue = watch(name);

    useEffect(() => {
        if (currentValue) setCustomColor(currentValue);
    }, [currentValue]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleColorChange = (color) => {
        setCustomColor(color);
        setValue(name, color, { shouldValidate: true });
    };

    const getPopupPosition = () => {
        if (popupPosition === "right")
            return { left: "100%", top: 0, marginLeft: "8px" };
        return { top: "100%", left: 0, marginTop: "8px" };
    };

    const err = anidarPropiedades(errors, name.split("."));

    return (
        <div className="relative inline-block" ref={popupRef}>
            <div className="space-y-2 w-full">
                {title && (
                    <label
                        htmlFor={name}
                        className="block text-sm font-medium text-foreground"
                    >
                        {title}
                        {required ? (
                            <span className="text-primary">*</span>
                        ) : null}
                    </label>
                )}
                <div>
                    {/* Botón principal */}
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 transition w-full"
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded-lg"
                                style={{ backgroundColor: customColor }}
                            />
                            <span className="text-sm">
                                {watch(name) || placeholder}
                            </span>
                        </div>
                        <ChevronDownIconLight
                            className={`${isOpen ? "rotate-180" : ""}`}
                            {...sizeIcon.small}
                        />
                    </button>

                    {/* Popup */}
                    {isOpen && (
                        <Card
                            className="absolute z-50 w-72 rounded-2xl bg-white p-4"
                            style={getPopupPosition()}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-sm font-medium text-gray-700">
                                    Elige un color
                                </h3>
                                {question && (
                                    <div className="relative group">
                                        <button
                                            type="button"
                                            className="rounded-full shadow p-1 bg-primary text-white hover:bg-primary/90 transition-colors"
                                        >
                                            <QuestionIconLight className="w-[12px] h-[12px]" />
                                        </button>
                                        <div className="absolute -top-[40px] right-1 p-2 min-w-[160px] text-xs rounded-lg bg-popover border border-border hidden group-hover:block z-10">
                                            {question}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Toggle Paleta / Picker */}
                            <div className="flex gap-2 mb-3">
                                <button
                                    className={`px-2 py-1 text-xs rounded-lg border ${
                                        mode === "palette"
                                            ? "bg-gray-100 border-gray-400 text-gray-800"
                                            : "border-gray-200 text-gray-500"
                                    }`}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMode("palette");
                                    }}
                                >
                                    🎨 Paleta
                                </button>
                                <button
                                    className={`px-2 py-1 text-xs rounded-lg border ${
                                        mode === "picker"
                                            ? "bg-gray-100 border-gray-400 text-gray-800"
                                            : "border-gray-200 text-gray-500"
                                    }`}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMode("picker");
                                    }}
                                >
                                    🖌 Picker
                                </button>
                            </div>

                            {/* Vista según modo */}
                            {mode === "palette" ? (
                                <div className="grid grid-cols-6 gap-2">
                                    {presetColors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleColorChange(color);
                                            }}
                                            style={{ backgroundColor: color }}
                                            className={`w-8 h-8 rounded-lg transition ${
                                                customColor === color
                                                    ? "ring-2 ring-blue-500"
                                                    : ""
                                            }`}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex justify-center mt-2">
                                    <input
                                        type="color"
                                        value={customColor}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                            handleColorChange(e.target.value)
                                        }
                                        className="w-20 h-20 cursor-pointer rounded-lg border border-gray-300"
                                        aria-label="Color picker"
                                    />
                                </div>
                            )}

                            {/* Input oculto para React Hook Form */}
                            <input
                                type="hidden"
                                {...register(name, options)}
                                value={customColor}
                            />
                        </Card>
                    )}
                </div>
            </div>
            {Object.keys(err).length ? (
                <p className="text-sm text-destructive flex items-center gap-1">
                    <span className="w-1 h-1 bg-destructive rounded-full" />
                    {err?.message}
                </p>
            ) : null}
        </div>
    );
}
