# Textor Text Workstation

Dokumentsprache : Deutsch mit Englisch

Module:
- frontend/ Textor Web Frontend
	- Vite
	- Typescript
	- React
	- Codemirror (wird ersetzt)
	- random-words
	- playwright/test
	- kein lint

## frontend/ Web Frontend

### Application Entry

[main.tsx](frontend/src/main.tsx)

### Main Files
- Textor main file [app.tsx](frontend/src/app/app.tsx)
- Application model [model.ts](frontend/src/app/model.ts)
- Application main context [context.tsx](frontend/src/app/context.tsx)
- Main Editor [editor.tsx](frontend/src/app/editor.tsx)

### Features

#### Editor

ContentEditable Eigenbau [editor/](../frontend/src/editor/Editor.tsx)

- Texteingabe mit dynamischer Formatierung (zB Hashtags)
- Copy/ Paste
- Undo/ Redo
- Verwendung von Emojis und Sonderzeichen
- Anzeige von Bildern

#### Datenverwaltung
- Daten- und Dokumentverwaltung im Local Storage
- Backup/ Restore/ Download

#### Effekte
- Ein Effekt erzeugt eine Ausgabe / meist basierend auf dem Text in Haupteditor
- Selbst- und vordefinierte Effekte gruppieren Anweisungen / Instructions

#### Instructions
- Statisch vordefinierte Instructions transformieren dein Eingabetext

#### Vault
- Der Vault speichert Werte : die im Haupteditor und in Instructions verwendet werden können (wip)

#### Strukturierung des Source Codes

- src/
	- app/
		- hooks/ : Custom Hooks
		- components/ : Reusable Components
		- panels/ : Editor Panels
		- static/ : Static definitions
			- css/ : CSS Files
			- documents/ : Document definitions
			- instructions/ : Instruction Definitions
			- svg/ : SVG Files
			- themes/ : Theme Definitions
		- 



## [text](../frontend/src/components/Editor.tsx)