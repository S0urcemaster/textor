import { CSSProperties } from "react"
import Input from "./Input"
import { useMaskedInput } from "../app/hooks/useMaskedInput"

export default ({ value, submit, style, placeholder }: { value: string, submit: (value: string) => void, style?: CSSProperties, placeholder: string }) => {

   const maskedInput = useMaskedInput(value, submit)

   return (
      <Input value={maskedInput.value} onChange={maskedInput.handleChange} placeholder={placeholder}
         onMouseEnter={maskedInput.onMouseEnter}
         onMouseLeave={maskedInput.onMouseLeave}
         submit={submit}
         style={style}
      />
   )
}