import { useState, useRef, useEffect, ReactNode } from "react"
import Button, { ButtonType } from "./Button"
import IconButton from "./IconButton"
import { useTextorContext } from "../../app/context"

const timeout = 500

type DoubleButtonType = {
   onActivateSecond: () => void,
   icons: ReactNode[],
   titles: string[],
} & ButtonType

export default function ({ icons, titles, disabled, style, onActivate, onActivateSecond }: DoubleButtonType) {

   const { system } = useTextorContext()
   const [set, setSet] = useState(false)
   const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

   useEffect(() => {
      if (set) {
         if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
         }
         timeoutRef.current = setTimeout(() => {
            onActivate()
            setSet(false)
         }, timeout)

      } else {
         if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
         }
      }
   }, [set])

   function firstClicked() {
      setSet(true)
      // onActivateSecond()
   }

   function secondClicked() {
      setSet(false)
      onActivateSecond()
   }

   return (
      <div style={{position: 'relative'}}>
         <IconButton disabled={disabled} style={{ color: system.settings.colors.buttonColor, ...style }} trigger='mousedown' onActivate={set ? secondClicked : firstClicked}
            icon={set ? icons[1] : icons[0]}>
            {set ? titles[1] : titles[0]}
         </IconButton>
         <div
            style={{
               position: 'absolute',
               top: 4,
               right: 10,
               width: 5,
               height: 5,
               borderRadius: '50%',
               border: `1px dotted ${system.settings.colors.mezzoDark}`,
               backgroundColor: set ? 'transparent' : system.settings.colors.lightDark,
               pointerEvents: 'none'
            }}
         />
         <div
            style={{
               position: 'absolute',
               top: 4,
               right: 4,
               width: 5,
               height: 5,
               borderRadius: '50%',
               border: `1px dotted ${system.settings.colors.mezzoDark}`,
               backgroundColor: set ? system.settings.colors.lightDark : 'transparent',
               pointerEvents: 'none'
            }}
         />
      </div>
   )
}
