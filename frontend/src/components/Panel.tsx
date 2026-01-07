import { CSSProperties, ReactNode } from "react"
import { useTextorContext } from "../app/context"
import DeviceLine from "./DeviceLine"

export default function ({ children, style }: { children: ReactNode, style?: CSSProperties }) {

   const { system } = useTextorContext()

   return (
      <>
         {/* <DeviceLine /> */}
         <div style={{background: `linear-gradient(to right, ${system.settings.colors.materialLo}, ${system.settings.colors.materialHi})`, padding: 1, borderRadius: 3,...style }}>

            {children}

         </div>
         <DeviceLine />
      </>
   )
}