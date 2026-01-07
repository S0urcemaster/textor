import { useEffect, useState } from "react"
import { Vault } from "../model"
import { usePasswordAutoClear } from "./passwordAutoClear"
import { lib } from "../../static/lib"
import { dlog, log } from "../../static/log"



type VaultInit = {
   cipher?: string
}

export default function (init: VaultInit) {

   const [cipher, setCipher] = useState<string>(init?.cipher ?? '')
   const [vault, setVault] = useState<Vault | undefined>()
   const [password, setPassword] = useState<string | undefined>()

   useEffect(() => {
      setCipher(init.cipher ?? '')
   }, [init.cipher])


   useEffect(() => {
      log([dlog.tvault], '[password]', { password, cipher: init.cipher }, import.meta.url)
      if (init.cipher && password) {
         lib.decrypt(init.cipher, password).then(res => {
            setVault(JSON.parse(res))
         }).catch(err => {
            console.log('error: ', err)
         })

      }
   }, [password])

   useEffect(() => {
      log([dlog.tvault], '[vault]', { password }, import.meta.url)

   }, [vault])

   function lockVault() {
      setPassword(undefined)
      setVault(undefined)
   }



   function updateExport() {
      log([dlog.tcontext], 'updateVaultExport()', {})
      // if (doc) {
      //    const ix = doc.effects.indexOf(document_vault_export_instruction)
      //    if (ix > 0) {
      //       doc.effects.splice(ix, 1, document_vault_export_instruction + state.vault)
      //    }
      // }
      // console.log('updateVaultExport', doc)
   }



   function doImport(vault: string) {
      log([dlog.tcontext], 'importVault', { vault })
      // state.vault = vault
      // updateVaultExport()
      // setVault(undefined)
      // setPassword(undefined)
      // saveStorage({ state: state })
   }

   usePasswordAutoClear(() => setPassword(undefined), 3000)

   return { vault, password, setPassword, cipher, import: doImport, lock: lockVault }
}
