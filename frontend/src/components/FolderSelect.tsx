import React, { CSSProperties, useEffect, useState } from 'react'
import { useTextorContext } from '../app/context'

import Selectable from './buttons/Selectable'

export default function ({ options, value, onChange, style }: { options: string[], value: string, onChange: (value: string) => void, style?: CSSProperties }) {

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
         {options?.map((option) => (
            <Selectable
               key={option}
               onActivate={() => handleSelect(option)}
               isSelected={selectedValue === option}
               style={{
                  width: '100%',
                  height: selectedValue === option ? 49 : 32,
                  justifyContent: 'flex-start',
                  paddingLeft: 6,
               }}
            >
               {option}
            </Selectable>
         ))}
      </div>
   )
}
