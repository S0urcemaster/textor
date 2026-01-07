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

export async function loadStorage(): Promise<StorageState> {
	let storage = JSON.parse(localStorage.getItem('textor')!) as StorageState
	if (!storage || !storage.state) {
		storage = JSON.parse(localStorage.getItem('textor')!)
	}
	log([dlog.tlocalstorage], '📤 loadStorage()', { storage })
	return storage
}

export function saveStorage(storage: StorageState) {
	log([dlog.tlocalstorage], '📥 saveStorage()', { storage })
	localStorage.setItem('textor', JSON.stringify(storage))
}
