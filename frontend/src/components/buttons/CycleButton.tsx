import { ReactNode, useState } from "react"
import Button, { ButtonType } from "./Button"

type CycleButtonType = {
   items: Record<string, ReactNode>
   onActivate: (key: string) => void
} & ButtonType

export default function ({ onActivate, items }: CycleButtonType) {

   const keys = Object.keys(items)
   const values = Object.values(items)
   const [current, setCurrent] = useState(0)

   function activated() {
      onActivate(keys[current] ?? '')
      setCurrent((current + 1) % keys.length)
   }

   return (
      <Button onActivate={activated} trigger='mousedown'>
         {values[current]}
      </Button>

   )
}
