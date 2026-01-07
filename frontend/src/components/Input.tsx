import { CSSProperties, useEffect, useRef, useState } from "react"
import { useTextorContext } from "../app/context"
import { robotoMonoFont } from "../static/constants"
import { lib } from "../static/lib"

export default ({ value, submit, style, placeholder, autoSubmit = false, ...props }: { value: string, submit: (value: string) => void, style?: CSSProperties, placeholder?: string, autoSubmit?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) => {

   const { system } = useTextorContext()
   const [currentValue, setCurrentValue] = useState(value)
   const inputRef = useRef<HTMLInputElement>(null)
   const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

   useEffect(() => {
      setCurrentValue(value)
   }, [value])

   useEffect(() => {
      if (autoSubmit) {
         timerRef.current = setTimeout(() => {
            if (inputRef.current) {
               submit(inputRef.current.value)
            }
         }, 250)
         return () => {
            if (timerRef.current) {
               clearTimeout(timerRef.current)
            }
         }
      }
   }, [currentValue])

   function onEnter() {
      if (autoSubmit && timerRef.current) {
         clearTimeout(timerRef.current)
      }
      if (inputRef.current) {
         submit(inputRef.current.value)
      }
   }

   return (
      <input ref={inputRef} className={robotoMonoFont.className} value={currentValue}
         onChange={e => {
            setCurrentValue(e.target.value)
            if (props.onChange) props.onChange(e)
         }}
         style={{
            height: 49, background: `linear-gradient(to top, ${lib.averageHexColor(system.settings.colors.editorBackgroundLo, '#646464ff')}, 
            ${system.settings.colors.editorBackgroundHi})`, color: system.settings.colors.editorColor, padding: '0px 5px 0px 10px', fontSize: 'larger',
            ...style
         }}
         onKeyDown={e => {
            if (e.key === "Enter") {
               inputRef.current?.blur()
               e.preventDefault()
               onEnter()
            }
            if (props.onKeyDown) props.onKeyDown(e)
         }}
         placeholder={placeholder}
         {...props}
      />
   )
}
