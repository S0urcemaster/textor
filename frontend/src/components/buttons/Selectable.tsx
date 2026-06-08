import { CSSProperties, ReactNode, useState } from 'react'
import { useTextorContext } from '../../app/context'

export type SelectableType = {
  children?: ReactNode
  disabled?: boolean
  style?: CSSProperties
  isSelected?: boolean
  onActivate: (e?: React.MouseEvent<HTMLDivElement>) => void
  trigger?: 'click' | 'mousedown'
}

const TRANSITION = 'all 0.005s ease-out'

export default function ({ children, disabled, onActivate, trigger = 'click', style, isSelected }: SelectableType) {
  const { system } = useTextorContext()

  const [hover, setHover] = useState(false)
  const [active, setActive] = useState(false)

  const isPressed = active
  const isOver = hover && !active

  let visualState = 'normal'
  if (disabled) visualState = 'disabled'
  else if (isPressed) visualState = 'pressed'
  else if (isSelected) visualState = 'selected'
  else if (isOver) visualState = 'over'

  let opacity = 1
  let filter = 'none'
  let overlayOpacity = 0.8

  let background = `linear-gradient(to top left, ${system.settings.colors.buttonBackgroundLo}, ${system.settings.colors.buttonBackgroundHi})`
  let color = system.settings.colors.buttonColor

  switch (visualState) {
    case 'disabled':
      opacity = 0.6
      filter = 'grayscale(100%)'
      overlayOpacity = 0.5
      break
    case 'pressed':
      opacity = 1
      filter = 'brightness(1.2)'
      overlayOpacity = 0.6
      break
    case 'selected':
      opacity = 1
      filter = 'brightness(1.1)'
      overlayOpacity = 1.0
      background = `linear-gradient(to top left, ${system.settings.colors.buttonBackgroundLo}, ${system.settings.colors.buttonBackgroundHi})`
      color = system.settings.colors.buttonColor
      break
    case 'over':
      opacity = 1
      filter = 'brightness(1.1)'
      overlayOpacity = 0.9
      break
    case 'normal':
    default:
      opacity = 1
      filter = 'brightness(1.0)'
      overlayOpacity = 0.8
      break
  }

  function mouseEnter() {
    if (disabled) return
    setHover(true)
  }

  function mouseLeave() {
    if (disabled) return
    setHover(false)
    setActive(false)
  }

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (disabled) return
    setActive(true)
    if (trigger === 'mousedown') onActivate(e)
  }

  function onMouseUp(e: React.MouseEvent<HTMLDivElement>) {
    if (disabled) return
    if (trigger === 'click' && active) {
      onActivate(e)
    }
    setActive(false)
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        userSelect: 'none',
        flex: style?.flex,
        width: style?.width,
        height: style?.height,
      }}
      role="button"
      data-interactive="true"
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onClick={e => e.preventDefault()}
    >
      <div
        style={{
          position: 'relative',
          transition: TRANSITION,
          opacity,
          filter,
          background: background,
          color: color,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
          ...style
        }}
      >
        {visualState !== 'selected' && <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `linear-gradient(to bottom, 
              rgba(255,255,255,${overlayOpacity}) 0%, 
              rgba(255,255,255,${0.1 * overlayOpacity}) 5%, 
              rgba(255,255,255,0) 50%, 
              rgba(0,0,0,${0.1 * overlayOpacity}) 95%, 
              rgba(0,0,0,${0.5 * overlayOpacity}) 100%)`
          }}
        />}



        {children}
      </div>
    </div>
  )
}
