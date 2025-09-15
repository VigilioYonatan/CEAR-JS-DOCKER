import { createContext } from "preact";
import { useContext, useState } from "preact/hooks";

export const textContext = createContext();

export const TextProvider = ({ children }) => {
	const [text, setText] = useState("");
	console.log("probando contexto test");

	return (
		<textContext.Provider value={{ text, setText }}>
			{children}
		</textContext.Provider>
	);
};
export const useTestContext = () => {
	if (!textContext) {
		throw new Error("useTestContext must be used within a TextProvider");
	}
	return useContext(textContext);
};
