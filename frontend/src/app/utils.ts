import { defaultState } from "../static/constants"
import { lib } from "../static/lib"
import { dlog, log } from "../static/log"
import { App, Document } from "./model"

export type UpdateStrategy = 'document' | 'settings' | 'vault'

const utils = {
	applyUpdateStrategy: (params: { state: App, strategy: UpdateStrategy[], forceUpdate?: boolean, updateDocuments: Document[] }): App => {

		const state = structuredClone(params.state)

		const settings = params.strategy.includes('settings') ? defaultState.settings : params.state.settings

		const getDocId = (doc: Document) => `${doc.folderName}/${doc.name}`

		const vault = params.strategy.includes('vault') ? defaultState.vault : params.state.vault

      const isDev = import.meta.env.VITE_DEV === 'true'
      if (params.state.version === defaultState.version) {
         if (isDev) {
            state.documents = Array.from(
               new Map(
                  [...params.state.documents, ...params.updateDocuments]
                     .map(doc => [getDocId(doc), doc])
               ).values()
            )
         }
      } else {
         if (isDev) {
            const documents = Array.from(
               new Map(
                  [...params.state.documents, ...params.updateDocuments]
                     .map(doc => [getDocId(doc), doc])
               ).values()
				)
				state.vault = vault
				state.documents = documents
				state.settings = settings
				state.version = defaultState.version
			} else {
				state.vault = defaultState.vault
				state.documents = defaultState.documents
				state.settings = defaultState.settings
				state.version = defaultState.version
			}
		}
		log([dlog.teditor], 'applyUpdateStrategy()', { result: state, ...params })
		return state
	},
	textStats: (doc: Document) => {
		if (!doc) return
		let stats = 'chars: ' + doc.editor!.text.length
		stats += ' tokens: ' + lib.estimateTokens(doc.editor!.text)
		stats += ' words: ' + lib.countWords(doc.editor!.text)
		return stats
	},
	copyToClipboard: (text: string) => {
		navigator.clipboard.writeText(text)
	},

	getFromClipboard: (): any => {
		return navigator.clipboard.readText()
	},

	syncSystemDocs: (documents: Document[], userChars: string) => {
		lib.findDoc(documents, 'System', 'user-chars')!.editor!.text = userChars
	}
}

export default utils
