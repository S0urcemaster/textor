import { ReactNode, useEffect, useState } from "react"
import { ButtonType } from "./Button"
import IconButton from "./IconButton"

type SafetyButtonProps = {
	icons: ReactNode[]
	captions: string[]
} & ButtonType

const timeout = 1000

export function SafetyButton({ children, onActivate, style, icons, captions, disabled }: SafetyButtonProps) {
	const [safety, setSafety] = useState(false)

	useEffect(() => {
		let timer: ReturnType<typeof setTimeout> | undefined

		if (safety) {
			timer = setTimeout(() => {
				setSafety(false)
			}, timeout)
		}

		return () => {
			if (timer) {
				clearTimeout(timer)
			}
		}
	}, [safety])

	function handleActivate(e: any) {
		if (safety) {
			setSafety(false)
			if (onActivate) onActivate(e)
		} else {
			setSafety(true)
		}
	}

	return (
		<IconButton disabled={disabled} onActivate={handleActivate} style={{ ...style }} icon={safety ? icons[1] : icons[0]}>{safety ? captions[1] : captions[0]}</IconButton>
	)
}
