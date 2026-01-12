import { CSSProperties, useEffect, useRef, useState } from "react"
import { useTextorContext } from "../app/context"
import { robotoMonoFont } from "../static/constants"

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
            height: 49,
            background: `linear-gradient(to top, ${system.settings.contrast ? system.settings.colors.editorBackgroundLoDark : system.settings.colors.editorBackgroundLoLight}, 
            ${system.settings.contrast ? system.settings.colors.editorBackgroundHiDark : system.settings.colors.editorBackgroundHiLight})`,
            color: system.settings.contrast ? system.settings.colors.editorColorDark : system.settings.colors.editorColorLight,
            padding: '0px 5px 0px 10px',
            fontSize: 'larger',
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
