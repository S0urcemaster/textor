import React, { CSSProperties, useEffect, useState } from 'react'
import { useTextorContext } from '../app/context'
import Input from './Input'
import { SafetyButton } from './buttons/SafetyButton'
import Selectable from './buttons/Selectable'
import phosphorIcons from '../static/svg/phosphorIcons'

export default ({ files, value, onChange, style, renamed, deleteClicked }: { files: string[], value: string, onChange: (file: string) => void, style?: CSSProperties, renamed: (text: string) => void, deleteClicked: () => void }) => {

   const { system, files: ctxfiles } = useTextorContext()
   const [fileName, setFileName] = useState(value)

   useEffect(() => {
      setFileName(value)
   }, [value])

   useEffect(() => {
   }, [fileName])

   return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
         {files?.map((option) =>
            fileName === option ?
               <div key={option} onMouseDown={() => onChange(option)} style={{
                  cursor: 'default',
                  padding: 0,
                  color: system.settings.colors.dark,
                  backgroundColor: system.settings.colors.inputBackground,
               }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', }}>
                     <Input value={fileName} submit={renamed} style={{ flexGrow: 1 }} />
                     <div style={{ display: 'flex', gap: 1 }}>
                        <SafetyButton disabled={!ctxfiles.currentDocument?.deletable} onActivate={deleteClicked} icons={[<phosphorIcons.Trash color={system.settings.colors.red} />, <phosphorIcons.Warning color={system.settings.colors.red} />]} captions={['delete', 'warng']} />
                     </div>
                  </div>
               </div> :
               <Selectable key={option} onActivate={() => onChange(option)} style={{ width: '100%', height: '100%', justifyContent: 'flex-start', padding: 5, paddingLeft: 8 }}
               >
                  {option}
               </Selectable>
         )}
      </div>
   )
}