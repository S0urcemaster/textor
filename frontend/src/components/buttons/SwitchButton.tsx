import { useEffect, useState } from "react"
import Button, { ButtonType } from "./Button"

type SwitchButtonType = {
   values: string[],
   value: number,
} & ButtonType

export function SwitchButton({ values, value, style, onActivate }: SwitchButtonType) {
   const [currentValue, setCurrentValue] = useState(value)

   useEffect(() => {
      onActivate()
   }, [currentValue])

   return (
      <Button style={{ textAlign: 'center', ...style }} onActivate={() => setCurrentValue(0)}>{values[currentValue]}</Button>
      // <Button style={{ textAlign: 'center', ...style }} onActivate={() => setCurrentValue(lib.getRotatedOffset(values.length, value, 1))}>{values[currentValue]}</Button>
   )
}
