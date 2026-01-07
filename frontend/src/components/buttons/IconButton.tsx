import { ReactNode } from "react"
import Button, { ButtonType } from "./Button"

export default ({ children, style, disabled, onActivate, icon, trigger }: ButtonType & { icon: ReactNode }) => {
   return (
      <Button disabled={disabled} style={{ ...style }} trigger={trigger} onActivate={onActivate}>
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            {icon}
            <div style={{ fontSize: 10 }}>{children}</div>
         </div>
      </Button>
   )
}