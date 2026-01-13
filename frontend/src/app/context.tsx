import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { App as AppModel, Document, Instruction, Settings, Vault } from './model'
import { defaultState, defaultVault } from '../static/constants'
import { loadStorage, saveStorage } from './localStorage'
import { lib } from '../static/lib'
import { gs } from '../static/instructions'
import { dlog, log, logInfo } from '../static/log'
import useEffectsManagement from './hooks/effectsContext'
import useEditorState from './hooks/editorContext'
import useVaultState from './hooks/vaultContext'
import utils, { UpdateStrategy } from './utils'
import { document_vault } from '../static/documents/system/vault'
import { document_vault_export_instruction } from '../static/documents/system/vault'

export type TextorContext = {
	files: {
		currentDocument: Document
		documents: Document[]
		resetStorage: () => Promise<void>
		setCurrentDocument: (doc: Document) => void
	}
	editor: {
		text: string
		setText: (text: string) => void
		fontSize: number
		fontSizeUp: () => void
		fontSizeDown: () => void
		fontFamily: string, nextFamily: () => void,
		lineHeight: number, lineHeightUp: () => void, lineHeightDown: () => void,
		letterSpacing: number, letterSpacingUp: () => void, letterSpacingDown: () => void,
		actions: EditorAction[]
		setActions: (actions: EditorAction[]) => void
	}
	effects: {
		current: Instruction[][]
		reloader: number
		selectedId: number
		add: (effect: string) => void
		deleteSelected: () => void
		isManual: (id: number) => boolean // TODO  -> lib
		setSelectedId: (n: number) => void
		updateSelected: (effectStr?: string) => void
	}
	vault: {
		vault: Vault
		password: string
		setPassword: (password: string) => void
		import: (vault: string) => void
		lock: () => void
		prepareExport: () => string | undefined
		update: (vault: Vault) => void
	}
	system: {
		documentsBackup: string
		settings: Settings
		backgroundAnimationRunning: boolean
		toggleBackgroundAnimation: () => void
		saveCurrentDocument: () => void
		saveVault: (params: { newVault: Vault }) => void
		updateSettings: (setting: any) => void
	}
}

const TextorContext = createContext<TextorContext>({} as TextorContext)

export type EditorAction = [
	name: string,
	payload?: string
]

export function TextorContextProvider({ children }: { children: ReactNode }) {

	const [state, setState] = useState<AppModel>()
	const [documents, setDocuments] = useState<Document[]>()
	const [currentDocument, setCurrentDocument] = useState<Document>()

	const documentsBackup = useRef('')

	const [settings, setSettings] = useState<Settings>(defaultState.settings)
	const [backgroundAnimationRunning, setBackgroundAnimationRunning] = useState(true)

	const [editorActions, setEditorActions] = useState<EditorAction[]>([])

	const [editorStateInit, setEditorStateInit] = useState({
		text: currentDocument?.editor!.text,
		family: currentDocument?.editor!.fontName,
		size: currentDocument?.editor!.fontSize,
		lineHeight: currentDocument?.editor!.lineHeight,
		letterSpacing: currentDocument?.editor!.letterSpacing
	})

	const { text: editorText, size: fontSize, family: fontFamily, nextFamily: nextFontFamily,
		lineHeight, letterSpacing, lineHeightUp, lineHeightDown, letterSpacingUp,
		letterSpacingDown, fontSizeUp, fontSizeDown, setText
	} = useEditorState({
		init: editorStateInit
	})

	const [vaultStateInit, setVaultStateInit] = useState<{ cipher?: string }>({ cipher: undefined })

	const { vault, cipher: vaultCipher, import: importVault,
		lock: lockVault,
		password: vaultPassword, setPassword: setVaultPassword,
	} = useVaultState(vaultStateInit)

	const {
		selectedId: selectedEffectId,
		reloader: effectsReloader,
		setReloader: setEffectsReloader,
		setSelectedId: setSelectedEffectId,
		isManual: isEffectManual,
		setEffects: setCurrentEffects, effects: currentEffects
	} = useEffectsManagement()


	useEffect(() => {
		logInfo([dlog.tcontext], '🌋 useEffect: mounted')
		const init = async () => {

			const storage = await loadStorage() || { state: defaultState }

			lib.indexDocuments(defaultState)
			lib.indexDocuments(storage.state)

			const encrypted = await lib.encrypt(JSON.stringify(defaultVault), 'pizza')
			defaultState.vault = encrypted

			let updateStrategy: UpdateStrategy[]
			const isDev = import.meta.env.DEV || import.meta.env.VITE_DEV === 'true'
			if (isDev) {
				// updateStrategy = ['settings', 'vault']
				updateStrategy = ['settings']
			} else {
				updateStrategy = ['settings', 'vault']
			}
			documentsBackup.current = storage.state.documents.filter(doc => doc.folderName === 'User').map(doc => `File: ${doc.folderName}/${doc.name}\n---------------------------\n${doc.editor!.text}`).join('\n\n')

			setState(utils.applyUpdateStrategy({
				state: storage.state, strategy: updateStrategy, forceUpdate: false, updateDocuments: [
					// document_default,
					// document_bluesky_x,
					// document_passmaker,
					// document_openai,
					// effect_caesar_cypher,
					// document_docs_intro,
					// document_paginator,
					// document_settings,
					// document_updates,
					// document_userchars,
					// document_vault,
				]
			}))

		}

		init()

	}, [])

	useEffect(() => {
		log([dlog.tcontext], '🧰 [state]', { state })
		if (state) {
			setVaultStateInit({ cipher: state.vault })
			setSettings(state.settings)
			setDocuments(state.documents)
		}
	}, [state])

	useEffect(() => {
		log([dlog.tcontext], '🔻 [documents]', { documents })
		if (documents) {
			utils.syncSystemDocs(documents, settings.userChars)
			setCurrentDocument(documents[0])
		}
	}, [documents])

	useEffect(() => {
		log([dlog.tcontext], '🔻 [currentDocument]', { currentDocument })
		if (state && currentDocument) {
			importVault(state.vault!)

			if (!currentDocument.editor!.text) currentDocument.editor!.text = ''

			setEditorStateInit({
				text: currentDocument.editor!.text,
				family: currentDocument.editor!.fontName ? currentDocument.editor!.fontName : 'Noto Sans',
				size: currentDocument.editor!.fontSize,
				lineHeight: currentDocument.editor!.lineHeight,
				letterSpacing: currentDocument.editor!.letterSpacing
			})

			const effects = currentDocument.effects.map(instructions => {
				const insts = lib.fromTextInstructions(instructions)
				return insts
			})
			setCurrentEffects(effects)
			setSelectedEffectId(undefined)
		}
	}, [currentDocument])

	useEffect(() => {
		log([dlog.tcontext], '🔻 [currentEffects]', { effects: JSON.stringify(currentEffects) })
		if (currentEffects) {
			if (currentDocument) {
				const eff = currentEffects.map(effect => lib.toTextInstructions(effect))
				currentDocument.effects = eff
			}
			if (state) {
				saveStorage({ state })
			}
		}
	}, [currentEffects])

	useEffect(() => {
		log([dlog.tcontext], '🔻 [settings]', { settings })
		if (settings && settings !== defaultState.settings) {
			if (state) {
				saveStorage({ state })
			}
		}
	}, [settings])

	useEffect(() => {
		if (currentDocument) {
			editorText && (currentDocument.editor!.text = editorText)
			fontFamily && (currentDocument.editor!.fontName = fontFamily)
			fontSize && (currentDocument.editor!.fontSize = fontSize)
			lineHeight && (currentDocument.editor!.lineHeight = lineHeight)
			letterSpacing && (currentDocument.editor!.letterSpacing = letterSpacing)
			saveCurrentDocument()
		}
	}, [fontSize, fontFamily, letterSpacing, lineHeight])

	useEffect(() => {
		if (currentDocument && editorText !== undefined) {
			currentDocument.editor!.text = editorText
			saveCurrentDocument()
			setEffectsReloader(effectsReloader + 1)
		}
	}, [editorText])

	useEffect(() => {

	}, [vaultCipher])

	async function resetStorage() {
		const encrypted = await lib.encrypt(JSON.stringify(defaultVault), 'pizza')
		const nextState = structuredClone(defaultState)
		nextState.vault = encrypted
		lib.indexDocuments(nextState)
		documentsBackup.current = nextState.documents
			.filter(doc => doc.folderName === 'User')
			.map(doc => `File: ${doc.folderName}/${doc.name}\n---------------------------\n${doc.editor!.text}`)
			.join('\n\n')
		saveStorage({ state: nextState })
		setState(nextState)
	}



	function addEffect(effect: string) {

	}

	function updateSelectedEffect(effectStr?: string) {
		if (!effectStr) {
			setEffectsReloader(effectsReloader + 1)
			return
		}
		log([dlog.tcontext], 'updateSelectedEffect()', { selectedEffectId, effectStr: `"${effectStr}"` })
		currentEffects![selectedEffectId!] = lib.fromTextInstructions(effectStr)
		currentDocument!.effects = currentEffects!.map(effect => lib.toTextInstructions(effect))
		saveCurrentDocument()
		setEffectsReloader(effectsReloader + 1)
	}

	function deleteSelectedEffect() {
		if (currentEffects!.length === 1) {
			setCurrentEffects([lib.fromTextInstructions(`giveitaname${gs}0${gs}20\nhelp`)])
			return
		}
		currentEffects!.splice(selectedEffectId!, 1)
		setCurrentEffects([...currentEffects!])
	}

	function updateSettings(setting: any) {
		const nextSettings = { ...settings, ...setting }
		if (state) {
			state.settings = nextSettings
		}
		setSettings(nextSettings)
	}

	function toggleBackgroundAnimation() {
		setBackgroundAnimationRunning((prev) => !prev)
	}
	function getVault() {

		return vault
	}

	function saveCurrentDocument() {
		const cdoc = lib.findDoc(state!.documents, currentDocument!.folderName, currentDocument!.name)
		if (!cdoc) {
			return
		}
		state!.documents.splice(state!.documents.indexOf(cdoc), 1, currentDocument!)
		log([dlog.tcontext], 'save()', state)
		if (state) {
			saveStorage({ state })
		}
	}

	function saveVault(params: { newVault: Vault }) {
		const { newVault } = params
		const append = { ...vault, ...newVault }
		lib.encrypt(JSON.stringify(append), append.vault_password).then(encrypted => {
			saveStorage({ state: { ...state!, vault: encrypted } })
		})
	}

	function updateVault(newVault: Vault) {
		saveVault({ newVault })
		const exportString = prepareExport()
		if (exportString && currentDocument?.name === document_vault.name && currentDocument.folderName === document_vault.folderName) {
			const effects = currentDocument.effects.map(instructions => {
				const insts = lib.fromTextInstructions(instructions)
				return insts
			})
			setCurrentEffects(effects)
			setEffectsReloader(effectsReloader + 1)
		}
	}

	function prepareExport() {
		const doc = lib.findDoc(documents!, document_vault.folderName, document_vault.name)
		if (doc) {
			const ix = doc.effects.findIndex(instruction => instruction.includes(document_vault_export_instruction.replace(gs, '')))
			if (ix > 0) {
				const fullInstruction = document_vault_export_instruction + (vaultStateInit.cipher ?? '')
				doc.effects.splice(ix, 1, fullInstruction)
				return fullInstruction
			}
		}
		return undefined
	}


	return (
		<TextorContext.Provider value={{
			files: {
				documents: documents!,
				currentDocument: currentDocument!,
				resetStorage,
				setCurrentDocument,
			},
			editor: {
				text: editorText, setText,
				fontSize, fontSizeUp: fontSizeUp, fontSizeDown: fontSizeDown,
				fontFamily, nextFamily: nextFontFamily,
				lineHeight, lineHeightUp, lineHeightDown,
				letterSpacing, letterSpacingUp, letterSpacingDown,
				actions: editorActions,
				setActions: setEditorActions,
			},
			effects: {
				current: currentEffects!,
				reloader: effectsReloader,
				selectedId: selectedEffectId!,
				add: addEffect,
				deleteSelected: deleteSelectedEffect,
				isManual: isEffectManual,
				setSelectedId: setSelectedEffectId,
				updateSelected: updateSelectedEffect,
			},
			vault: {
				vault: vault!,
				password: vaultPassword!,
				import: importVault,
				lock: lockVault,
				prepareExport: prepareExport,
				setPassword: setVaultPassword,
				update: updateVault,
			},
			system: {
				documentsBackup: documentsBackup.current,
				settings,
				backgroundAnimationRunning,
				toggleBackgroundAnimation,
				saveCurrentDocument,
				saveVault,
				updateSettings,
			},
		}}>
			{children}
		</ TextorContext.Provider>
	)
}
export function useTextorContext() {
	return useContext(TextorContext)
}

function syncConfigDoc(state: AppModel, arg1: string) {
	throw new Error('Function not implemented.')
}
