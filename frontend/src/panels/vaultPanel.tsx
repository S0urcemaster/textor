import { useEffect, useState } from 'react'
import { useTextorContext } from '../app/context'
import KeyManager from '../components/KeyManager'
import ValueTextArea from '../components/ValueTextArea'
import InputPassword from '../components/InputPassword'
import IconButton from '../components/buttons/IconButton'
import phosphorIcons from '../static/svg/phosphorIcons'
import { document_vault } from '../static/documents/system/vault'
import { lib } from '../static/lib'
import { dlog, log } from '../static/log'
import { SafetyButton } from '../components/buttons/SafetyButton'
import Panel from '../components/Panel'

export default () => {
   const { vault, system, files } = useTextorContext()

   const [password, setPassword] = useState(vault.password)
   const [key, setKey] = useState('')
   const [value, setValue] = useState('')

   useEffect(() => {
      vault.setPassword(password)
   }, [password])

   useEffect(() => {
      log([dlog.tvault], '[vault.vault]', vault.vault)
   }, [vault.vault])

   useEffect(() => {
      if (vault?.vault) {
         setValue(vault.vault[key])
      }
   }, [key])

   useEffect(() => {
   }, [value])

   function onRename(key: string) {

   }

   function onDelete(key: string) {

   }

   function valueChange(value: string) {
      vault.update({ [key]: value })
   }

   function lockClicked() {
      vault.lock()
   }

   function docClicked() {
      const doc = lib.findDoc(files.documents, document_vault.folderName, document_vault.name)
      if (doc) {
         files.setCurrentDocument(doc)
      }
   }

   return (
      <Panel style={{ display: 'grid', gap: 1, gridTemplateColumns: '300px auto' }}>
         <div style={{ display: 'flex', gap: 1 }}>
            <IconButton onActivate={lockClicked} icon={<phosphorIcons.Lock color={system.settings.colors.buttonColor} />}>lock</IconButton>
            <IconButton onActivate={docClicked} icon={<phosphorIcons.FileText color={system.settings.colors.buttonColor} />}>doc</IconButton>
            <SafetyButton onActivate={lockClicked} icons={[<phosphorIcons.Backspace color={system.settings.colors.red} />, <phosphorIcons.Warning color={system.settings.colors.red} />]} captions={['clear', 'warng']} />
         </div>
         <InputPassword value={vault?.password ?? ''} submit={vault.setPassword} placeholder='Vault password (default: pizza)' />
         {vault?.vault ?
            <>
               <KeyManager keys={Object.keys(vault.vault)} selectedKey={Object.keys(vault.vault)[0]} onChange={setKey} style={{ width: '100%', height: 100 }} onRename={onRename} onDelete={onDelete} />
               <ValueTextArea value={value} onChange={valueChange} />
            </>
            :
            <></>
         }

      </Panel>
   )
}
