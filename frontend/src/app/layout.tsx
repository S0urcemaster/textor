import { CSSProperties, ReactNode } from "react";
import { fonts, FONT_GLUTEN } from "../static/constants";

export default function RootLayout({ children }: { children: ReactNode }) {
	const fontName = FONT_GLUTEN;
	const fontClass = fonts[fontName].className;
	const fontStyle: Record<string, CSSProperties> = {
		[FONT_GLUTEN]: { fontSize: 14 },
	};

	return (
		<div className={`layout ${fontClass}`} style={{ ...fontStyle[fontName] }}>
			{children}
		</div>
	);
}
