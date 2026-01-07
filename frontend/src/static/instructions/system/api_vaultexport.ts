import { Instruction } from '../../../app/model'
import { gs } from '../../instructions'
import { dlog, log, logBold } from '../../log'

export const instruction_api_vaultexport: Instruction = {
  name: 'apivaultexport',
  update: async (text: string, data: string) => {
    if (!data) return `Usage: apivaultexport${gs}data`

    const baseUrl = import.meta.env.VITE_DEV === 'true'
      ? 'http://localhost:4444'
      : 'https://digi-craft.de/api/vault'

    logBold([dlog.tvault], 'instruction_api_vaultexport/data', { data })
    try {
      const res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, ttl: 300 })
      })
      logBold([dlog.tvault], 'instruction_api_vaultexport/res', { res })

      if (!res.ok) {
        const err = await res.text()
        return `Vault upload failed: ${res.status} ${err}`
      }

      const json = await res.json()
      return `Vault stashed. ID: ${json.id} (expires in ${json.expiresIn}s)`
    } catch (err: any) {
      logBold([dlog.tvault], 'instruction_api_vaultexport/err', { err })
      return `Vault export error: ${err.message || err}`
    }
  },
  manual: true
}
