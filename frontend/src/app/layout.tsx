import { CSSProperties, ReactNode } from "react"
import { fonts, FONT_GLUTEN } from "../static/constants"

export default function RootLayout({
	children,
}: {
	children: ReactNode
}) {

	const fontName = FONT_GLUTEN

	const fontClass = fonts[fontName].className
	const fontStyle: Record<string, CSSProperties> = {
		// [FONT_TINY5]: {lineHeight: 1},
		[FONT_GLUTEN]: { fontSize: 14 },
	}
	return (
		<html lang="en" className={fontClass} style={{ ...fontStyle[fontName] }}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Textor – Digi Craft</title>
				<meta
					name="description"
					content="Textor – Online source text editor with charsets and text transformer"
				/>
				<meta
					name="keywords"
					content="Textor, Digi Craft, Editor, Notepad, Writer, Type, Edit, HTML Characters, Charsets, Text Transformer"
				/>

				{/* Open Graph / Facebook */}
				<meta property="og:title" content="Textor – Source Text Editor" />
				<meta
					property="og:description"
					content="Textor – Online source text editor with charsets and text transformer"
				/>
				<meta
					property="og:image"
					content="https://digi-craft.de/textor/screenshot.png"
				/>
				<meta property="og:url" content="https://digi-craft.de/textor" />
				<meta property="og:type" content="website" />

				{/* Twitter Card */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Textor – Source Text Editor" />
				<meta
					name="twitter:description"
					content="Textor – Online source text editor with charsets and text transformer"
				/>
				<meta
					name="twitter:image"
					content="https://digi-craft.de/textor/screenshot.png"
				/>
			</head>

			<body>
				<div className='layout'>
					{children}
				</div>
			</body>
		</html>
	)
}
