import React, { CSSProperties, useEffect, useState } from 'react'
import { useTextorContext } from '../app/context'

import Selectable from './buttons/Selectable'

export default function ({ options, value, onChange, style, horizontal }: { options: string[], value: string, onChange: (value: string) => void, style?: CSSProperties, horizontal?: boolean }) {

   const [selectedValue, setSelectedValue] = useState(value)
   const { system } = useTextorContext()

   useEffect(() => {
      setSelectedValue(value)
   }, [value])

   const handleSelect = (value: string) => {
      setSelectedValue(value)
      onChange(value)
   }

   return (
      <div style={{ display: 'flex', flexDirection: horizontal ? 'row' : 'column', gap: 1, width: horizontal ? '100%' : undefined }}>
         {options?.map((option) => (
            <Selectable
               key={option}
               onActivate={() => handleSelect(option)}
               isSelected={selectedValue === option}
               style={horizontal ? {
                  flex: 1,
                  height: 28,
                  justifyContent: 'center',
                  background: system.settings.contrast ? system.settings.colors.accentButton : '#e1ebf6',
                  color: system.settings.contrast
                     ? selectedValue === option ? system.settings.colors.accent : system.settings.colors.bright
                     : system.settings.colors.dark,
                  fontWeight: selectedValue === option ? 'bold' : 'normal',
               } : {
                  width: '100%',
                  height: selectedValue === option ? 49 : 32,
                  justifyContent: 'flex-start',
                  paddingLeft: 6,
               }}
            >
               {horizontal
                  ? <span style={{ display: 'inline-block', transform: 'translateY(3px)' }}>{option}</span>
                  : option}
            </Selectable>
         ))}
      </div>
   )
}
