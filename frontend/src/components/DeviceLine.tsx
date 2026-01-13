import { useTextorContext } from "../app/context"

type DeviceLineProps = {
   vertical?: boolean
}

export default function ({ vertical = false }: DeviceLineProps) {

   const { system } = useTextorContext()
   const sizeStyle = vertical ? { width: 1, height: "100%" } : { height: 1, width: "100%" }

   return (
      <div style={{ display: "flex", ...sizeStyle, background: `linear-gradient(to right, #9b8226ff, ${system.settings.colors.accent}, #9b8226ff, ${system.settings.colors.accent}, #9b8226ff)` }}>
      </div>
   )
}
