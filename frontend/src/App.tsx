import "./static/css/globals.css";
import { CSSProperties } from "react";
import TextorApp from "./app/app";
import { TextorContextProvider } from "./app/context";
import { fonts, FONT_GLUTEN } from "./static/constants";

function App() {
	const fontName = FONT_GLUTEN;
	const fontClass = fonts[fontName].className;
	const fontStyle: Record<string, CSSProperties> = {
		[FONT_GLUTEN]: { fontSize: 14 },
	};

	return (
		<div className={`layout ${fontClass}`} style={{ ...fontStyle[fontName] }}>
			<div className="page" style={{ position: "relative" }}>
				<TextorContextProvider>
					<TextorApp />
				</TextorContextProvider>
			</div>
		</div>
	);
}

export default App;
