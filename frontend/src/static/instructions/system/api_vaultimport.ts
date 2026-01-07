import { Instruction } from '../../../app/model'
import { gs } from '../../instructions'

const base22 = 'ACDEFHIJKLMNPQRTWXY349'
const idRegex = new RegExp(`^[${base22}]{5}$`, 'i')

export const instruction_api_vaultimport: Instruction = {
	name: 'apivaultimport',
	update: async (text: string, id: string) => {
		if (!id) return `Usage: apivaultimport${gs}id`

		// ID validieren
		if (!idRegex.test(id)) {
			return `Error: Invalid id`
		}

		const baseUrl = import.meta.env.VITE_DEV === 'true'
			? 'http://localhost:4444'
			: 'https://digi-craft.de/api/vault'

		try {
			const res = await fetch(`${baseUrl}/${id.toUpperCase()}`)

			if (!res.ok) {
				const err = await res.text()
				return `Error: Vault fetch failed: ${res.status} ${err}`
			}

			const json = await res.json()
			return json.data || '(empty vault)'
		} catch (err: any) {
			return `Error: Vault import error: ${err.message || err}`
		}
	},
	manual: true
}
