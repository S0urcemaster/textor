import { useTextorContext } from "../app/context"
import { robotoMonoFont } from "../static/constants"
import { useMaskedInput } from "../app/hooks/useMaskedInput"

export default ({ value, onChange }: { value: string, onChange: (value: string) => void }) => {

   const { system } = useTextorContext()

   const maskedInput = useMaskedInput(value, onChange)

   return (
      <textarea
         value={maskedInput.value}
         onChange={maskedInput.handleChange}
         onMouseEnter={maskedInput.onMouseEnter}
         onMouseLeave={maskedInput.onMouseLeave}

         className={robotoMonoFont.className}
         style={{
            height: '100%',
            width: '100%',
            resize: 'none',
            paddingLeft: 10,
            background: `linear-gradient(to top, ${system.settings.colors.editorBackgroundLo}, ${system.settings.colors.editorBackgroundHi})`,
            color: system.settings.colors.effectEditorColor,
         }}
      />
   )
}