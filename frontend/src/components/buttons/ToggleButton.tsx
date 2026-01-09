import { ReactNode, useEffect, useState } from "react"
import IconButton from "./IconButton"
import { ButtonType } from "./Button"

type ToggleButtonType = {
  title: string
  icons: [ReactNode, ReactNode]
  value?: boolean
  onToggle?: (value: boolean) => void
} & Omit<ButtonType, 'onActivate'> & { onActivate?: ButtonType['onActivate'] }

export default function ({ title, icons, value = false, onToggle, onActivate, ...rest }: ToggleButtonType) {
  const [isOn, setIsOn] = useState(value)

  useEffect(() => {
    setIsOn(value)
  }, [value])

  function toggle() {
    setIsOn(prev => {
      const next = !prev
      onToggle?.(next)
      return next
    })
    onActivate?.()
  }

  return (
    <IconButton {...rest} onActivate={toggle} icon={isOn ? icons[1] : icons[0]} isSelected={isOn}>
      {title}
    </IconButton>
  )
}
