import { useTextorContext } from "../app/context"

export default function () {

   const { system } = useTextorContext()

   return (
      <div style={{ display: 'flex', height: 1, background: `linear-gradient(to right, #9b8226ff, ${system.settings.colors.accent}, #9b8226ff, ${system.settings.colors.accent}, #9b8226ff)` }}>
      </div>
   )
}