import { defaultState, defaultVault } from '../static/constants'
import { lib } from '../static/lib'
import { dlog, log } from '../static/log'
import { App as AppModel } from './model'

type LocalStorage = {
	download: Function
	upload: Function
	storageLoaded: boolean
	state: AppModel
}

type StorageState = {
	state: AppModel
}

const softBreakToken = '\v'
const softBreakStorageToken = '/n'

const encodeSoftBreaks = (value: string) => value.replaceAll(softBreakToken, softBreakStorageToken)
const decodeSoftBreaks = (value: string) => value.replaceAll(softBreakStorageToken, softBreakToken)

const mapDocumentText = (state: AppModel | undefined, mapText: (value: string) => string): AppModel | undefined => {
	if (!state) return state
	return {
		...state,
		documents: state.documents.map(doc => ({
			...doc,
			editor: doc.editor ? { ...doc.editor, text: mapText(doc.editor.text ?? '') } : doc.editor,
		})),
	}
}

export async function loadStorage(): Promise<StorageState> {
	let storage = JSON.parse(localStorage.getItem('textor')!) as StorageState
	if (!storage || !storage.state) {
		storage = JSON.parse(localStorage.getItem('textor')!)
	}
	if (storage?.state) {
		storage = { ...storage, state: mapDocumentText(storage.state, decodeSoftBreaks) }
	}
	log([dlog.tlocalstorage], '📤 loadStorage()', { storage })
	return storage
}

export function saveStorage(storage: StorageState) {
	const encoded = { ...storage, state: mapDocumentText(storage.state, encodeSoftBreaks) }
	log([dlog.tlocalstorage], '📥 saveStorage()', { storage: encoded })
	localStorage.setItem('textor', JSON.stringify(encoded))
}
