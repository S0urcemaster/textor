import { useEffect, useState } from "react"

export function useMaskedInput(initialValue: string, onSubmit: (value: string) => void) {
   const [currentValue, setCurrentValue] = useState<string>('')
   const maskedValue = currentValue.replace(/./g, '*')
   const [hover, setHover] = useState(false)

   useEffect(() => {
      setCurrentValue(initialValue ?? '')
   }, [initialValue])

   useEffect(() => {
      const handler = setTimeout(() => {
         onSubmit(currentValue)
      }, 250)
      return () => clearTimeout(handler)
   }, [currentValue, onSubmit])

   function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
      const inputValue = e.target.value
      if (!hover) {
         if (inputValue.length > currentValue.length) {
            const diff = inputValue.length - currentValue.length
            const nativeEvent = e.nativeEvent as InputEvent
            const newChar = nativeEvent.data?.slice(-diff) || ''
            setCurrentValue(currentValue + newChar)
         } else if (inputValue.length < currentValue.length) {
            setCurrentValue(currentValue.slice(0, inputValue.length))
         }
      } else {
         setCurrentValue(inputValue)
      }
   }

   return {
      value: hover ? currentValue : maskedValue,
      handleChange,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      currentValue  // useful if component needs raw value for other reasons, though typically 'value' return is what's displayed
   }
}
