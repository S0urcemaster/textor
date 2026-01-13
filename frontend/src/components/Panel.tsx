import { CSSProperties, ReactNode } from "react"
import { useTextorContext } from "../app/context"
import DeviceLine from "./DeviceLine"

export default function ({ children, style }: { children: ReactNode, style?: CSSProperties }) {

	const { system } = useTextorContext()

	return (
		<>
			{/* <div style={{ background: `linear-gradient(to right, ${system.settings.colors.materialLo}, ${system.settings.colors.materialHi})`, padding: 1, borderRadius: 3, ...style }}> */}
			<div
				onClick={(event) => {
					const target = event.target as HTMLElement | null
					if (target?.closest('[data-interactive="true"], a, button, input, textarea, select, [role="button"]')) return
					system.toggleBackgroundAnimation()
				}}
				style={{ padding: 1, borderRadius: 3, ...style }}
			>

				{children}

			</div>
			{!system.settings.horizontalLayout && <DeviceLine />}
		</>
	)
}
