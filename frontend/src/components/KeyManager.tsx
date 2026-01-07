import React, { CSSProperties, useEffect, useState } from 'react'
import { useTextorContext } from '../app/context'
import { SafetyButton } from './buttons/SafetyButton'
import phosphorIcons from '../static/svg/phosphorIcons'
import Input from './Input'
import Selectable from './buttons/Selectable'

export default ({ keys, selectedKey, onChange, style, onRename, onDelete }: { keys: string[], selectedKey: string, onChange: (key: string) => void, style?: CSSProperties, onRename: (key: string) => void, onDelete: (key: string) => void }) => {

   const { system } = useTextorContext()
   const [currentKey, setCurrentKey] = useState<string>(selectedKey)

   useEffect(() => {
      setCurrentKey(selectedKey)
   }, [selectedKey])

   useEffect(() => {
      onChange(currentKey)
   }, [currentKey, onChange])

   function handleSelect(key: string) {
      setCurrentKey(key)
      onChange(key)
   }

   function deleteClicked() {
      onDelete(currentKey)
   }

   function keySubmit(name: string) {
      onRename(name)
   }

   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
         {keys.map((key) =>
            currentKey === key ?
               <div style={{
                  cursor: 'default',
                  padding: 0,
                  color: system.settings.colors.dark,
                  backgroundColor: system.settings.colors.inputBackground,
               }}
                  key={key}
                  onMouseDown={() => handleSelect(key)}
               >
                  <div style={{ display: 'flex' }}>
                     <Input submit={keySubmit} value={currentKey} style={{ width: '100%' }} />
                     <SafetyButton onActivate={deleteClicked} icons={[<phosphorIcons.Trash color={system.settings.colors.red} />, <phosphorIcons.Warning color={system.settings.colors.red} />]} captions={['delete', 'warng']} />
                  </div>
               </div>
               :
               <Selectable
                  key={key}
                  onActivate={() => handleSelect(key)}
                  trigger='mousedown'
                  style={{ width: '100%', justifyContent: 'flex-start', padding: 5 }}
               >
                  {key}
               </Selectable>
         )
         }
      </div >
   )
}
