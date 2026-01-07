import { useState, useRef, useEffect } from "react"
import Button, { ButtonType } from "./Button"

const timeout = 500

type DoubleButtonType = {
   values: string[], disabled?: boolean, onActivateSecond: () => void
} & ButtonType

export function DoubleButton({ values, disabled, style, onActivate, onActivateSecond }: DoubleButtonType) {

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
      <>
         <Button disabled={disabled} style={{ ...style }} onActivate={set ? secondClicked : firstClicked}>{set ? values[1] : values[0]}</Button>
      </>
   )
}
