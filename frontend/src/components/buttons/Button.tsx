import Selectable, { SelectableType } from './Selectable'

export type ButtonType = {
} & SelectableType

export default ({ children, style, disabled, onActivate, trigger = 'click' }: ButtonType) => {

   return (
      <Selectable onActivate={onActivate} trigger={trigger}
         style={{
            width: 49,
            height: 49,
            paddingTop: 5,
            ...style
         }}
         disabled={disabled}>
         {children}
      </Selectable>
   )
}
