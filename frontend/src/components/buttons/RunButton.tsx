import { useEffect } from "react"
import { useTextorContext } from "../../app/context"
import phosphorIcons from "../../static/svg/phosphorIcons"
import { ButtonType } from "./Button"
import IconButton from "./IconButton"
import { dlog, log } from "../../static/log"

export type RunButtonType = {
   manual: boolean
   api: boolean
} & ButtonType

export default function ({ onActivate, manual, api }: RunButtonType) {

   const { system } = useTextorContext()

   useEffect(() => {
      log([dlog.teffects], '[manual, api]', {manual, api})
   }, [manual, api])

   return (
      <IconButton onActivate={onActivate} disabled={!manual}
         icon={<phosphorIcons.Play
            color={api ?
               manual ? system.settings.colors.red : system.settings.colors.yellow
               :
               manual ? system.settings.colors.blue : system.settings.colors.buttonColor}
         />}
      >
         {api ?
            manual ? 'remote' : 'auto'
            :
            manual ? 'run' : 'auto'}
      </IconButton>
   )
}