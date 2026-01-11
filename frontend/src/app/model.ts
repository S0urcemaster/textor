
export type Vault = Record<string, string>

export type App = {
	version: string
	documents: Document[]
	settings: Settings
	vault: string | undefined
}

export type Player = {
	station: number
	volume: number
	userStations: string[]
	availableStations: Station[]
}

export type Station = {
	name: string
	url: string
}

export type Document = {
	id?: number
	name: string
	folderName: string
	editor?: Editor
	effects: string[]
	editable: boolean
	deletable: boolean

}

export type Editor = {
	text: string
	fontName?: string
	fontSize?: number
	lineHeight?: number
	letterSpacing?: number
}

export type Settings = {
	colors: {
		buttonBackgroundLo: string
		buttonBackgroundHi: string
		buttonColor: string
		editorBackgroundHi: string
		editorBackgroundLo: string
		editorColor: string
		effectEditorColor: string
		inputBackground: string
		materialMedian: string
		materialHi: string
		materialLo: string
		pageBackground: string
		selectedColor: string

		accent: string
		blue: string
		blueAccent: string
		green: string
		bright: string
		dark: string
		lightDark: string
		mezzoDark: string
		red: string
		yellow: string

	}


	effectEditorFontSize: number
	width: number
	horizontalLayout: boolean
	userChars: string
	spellCheck: boolean
	contrast: boolean

}


export type Effect = {
	name: string
	sourceId: number
	instructions: string
}

export interface Instruction {
	name: string
	args?: string[]
	update: (text: string, ...args: string[]) => Promise<string>
	manual: boolean
}
