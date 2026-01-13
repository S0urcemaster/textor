import Editor from './editor'
import Head, { menuCommands } from './head'
import { useTextorContext } from './context'
import Effect from './effect'
import { type CSSProperties, useEffect, useRef, useState } from 'react'
import CharsPanel from '../panels/charsPanel'
import DocsPanel from '../panels/docsPanel'
import { InfoPanel } from '../panels/infoPanel'
import VaultPanel from '../panels/vaultPanel'
import ImagesPanel from '../panels/imagesPanel'
import DeviceLine from '../components/DeviceLine'

type Glyph = {
	id: string
	char: string
	x: number
	y: number
	size: number
	color: string
	duration: number
	opacity: number
}

const pastelColors = [
	"rgb(248, 197, 210)",
	"rgb(196, 232, 210)",
	"rgb(199, 218, 252)",
	"rgb(252, 234, 188)",
	"rgb(224, 204, 244)",
	"rgb(191, 230, 240)"
]

const darkPastelColors = [
	"rgb(140, 48, 72)",
	"rgb(24, 118, 86)",
	"rgb(52, 86, 158)",
	"rgb(146, 92, 28)",
	"rgb(118, 58, 150)",
	"rgb(18, 120, 138)"
]

// const letters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890🙂😄😎🥰😋🥳🤠🤓🤪😮🤯"]
// const letters = [..."TEXTORtextorDIGICRAFTdigicraft🙂😄😎🥰😋🥳🤠🤓🤪😮🤯"]
const letters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz12345678901234567890🙂😄😎🥰😋🥳🤠🤓🤪😮🤯"]

function AppBackground({
	opacity = 0.35,
	running = true,
	contrast = true
}: {
	opacity?: number
	running?: boolean
	contrast?: boolean
}) {

	const containerRef = useRef<HTMLDivElement | null>(null)
	const [glyphs, setGlyphs] = useState<Glyph[]>([])

	useEffect(() => {
		let active = true
		let timer: number | undefined

		if (!running) {
			return () => {
				active = false
				if (timer) window.clearTimeout(timer)
			}
		}

		const spawnGlyph = () => {
			const rect = containerRef.current?.getBoundingClientRect()
			const width = rect?.width ?? 420
			const height = rect?.height ?? 260
			const duration = 1000 + Math.random() * 2000
			const id = `${Date.now()}-${Math.random()}`
			const palette = contrast ? pastelColors : darkPastelColors
			const glyph: Glyph = {
				id,
				char: letters[Math.floor(Math.random() * letters.length)],
				x: Math.random() * 100,
				y: Math.random() * 100,
				size: 24 + Math.random() * 36,
				color: palette[Math.floor(Math.random() * palette.length)],
				duration,
				opacity
			}

			if (width > 0 && height > 0) {
				setGlyphs((prev) => [...prev, glyph])
				window.setTimeout(() => {
					setGlyphs((prev) => prev.filter((item) => item.id !== id))
				}, duration)
			}
		}

		const schedule = () => {
			if (!active) return
			const delay = 55 + Math.random() * 105
			timer = window.setTimeout(() => {
				spawnGlyph()
				schedule()
			}, delay)
		}

		schedule()

		return () => {
			active = false
			if (timer) window.clearTimeout(timer)
		}
	}, [opacity, running, contrast])

	return (
		<div ref={containerRef} style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 2 }}>
			<style>{`
					@keyframes infoPanelFade {
						0% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
						12% { opacity: var(--glyph-opacity); transform: translate(-50%, -50%) scale(1); }
						100% { opacity: 0; transform: translate(-50%, -50%) scale(1.05); }
					}
				`}</style>
			{glyphs.map((glyph) => {
				const glyphStyle: CSSProperties = {
					position: "absolute",
					left: `${glyph.x}%`,
					top: `${glyph.y}%`,
					fontSize: glyph.size,
					color: glyph.color,
					animation: `infoPanelFade ${glyph.duration}ms ease-out forwards`,
					whiteSpace: "pre"
				}
				return (
					<span
						key={glyph.id}
						style={{ ...glyphStyle, ['--glyph-opacity']: `${glyph.opacity}` } as CSSProperties}
					>
						{glyph.char}
					</span>
				)
			})}
		</div>
	)
}

export default function () {

	const { effects, system } = useTextorContext()
	const [currentMenu, setCurrentMenu] = useState(menuCommands.chars)
	const [menuVisible, setMenuVisible] = useState(true)
	// const [horizontalLayout, setHorizontalLayout] = useState(system.settings.horizontalLayout)

	useEffect(() => {
		// if (!system.settings.horizontalLayout) {
		// 	baseWidthRef.current = 302
		// }
	}, [system.settings.horizontalLayout])

	useEffect(() => {
		if (system.settings.horizontalLayout) {
			system.updateSettings({ horizontalLayout: system.settings.horizontalLayout, width: 1604 })
		} else {
			system.updateSettings({ horizontalLayout: system.settings.horizontalLayout, width: 802 })
		}
	}, [system.settings.horizontalLayout])

	function menuClicked(ix: string) {
		if (currentMenu === ix) {
			if (menuVisible) setMenuVisible(false)
			else setMenuVisible(true)
		} else {
			setMenuVisible(true)
			setCurrentMenu(ix)
		}
	}

	return (
		<div style={{
			background: `linear-gradient(to right, ${system.settings.colors.materialLo}, ${system.settings.colors.materialHi})`,
			width: system.settings.width,
			position: "relative",
			overflow: "hidden"
		}}>
			<AppBackground
				opacity={system.settings.contrast ? 0.5 : 0.2}
				running={system.backgroundAnimationRunning}
				contrast={system.settings.contrast}
			/>
			<div style={{
				position: "relative",
				zIndex: 1,
				display: 'grid',
				gridTemplateColumns: system.settings.horizontalLayout ? '1fr 3px 2fr' : '1fr',
				width: "100%"
			}}>
				{system.settings.horizontalLayout ? (
					<>
						<div style={{ flex: 1 }}>
							{menuVisible && currentMenu === menuCommands.chars &&
								<CharsPanel />
							}
							{menuVisible && currentMenu === menuCommands.docs &&
								<DocsPanel />
							}
							{menuVisible && currentMenu === menuCommands.images &&
								<ImagesPanel />
							}
							{menuVisible && currentMenu === menuCommands.vault &&
								<VaultPanel />
							}
							{menuVisible && currentMenu === menuCommands.textor &&
								<InfoPanel />
							}
							{effects.current?.map((instructions, ix) => {
								const primary = instructions?.[0]
								if (!primary) return null
								return (
									<Effect
										key={ix}
										id={ix}
										name={primary.name}
										sourceId={Number(primary.args?.[0])}
										fullInstructions={instructions}
									/>
								)
							})}
						</div>
						<DeviceLine vertical />
						<div style={{ flex: 1 }}>
							<Head menuClicked={menuClicked} />
							<Editor />
						</div>
					</>
				) : (
					<>
						<div style={{ flex: 1 }}>
							<Editor />
							<Head menuClicked={menuClicked} />
						</div>
						<div style={{ flex: 1 }}>
							{menuVisible && currentMenu === menuCommands.chars &&
								<CharsPanel />
							}
							{menuVisible && currentMenu === menuCommands.docs &&
								<DocsPanel />
							}
							{menuVisible && currentMenu === menuCommands.images &&
								<ImagesPanel />
							}
							{menuVisible && currentMenu === menuCommands.vault &&
								<VaultPanel />
							}
							{menuVisible && currentMenu === menuCommands.textor &&
								<InfoPanel />
							}
							{effects.current?.map((instructions, ix) => {
								const primary = instructions?.[0]
								if (!primary) return null
								return (
									<Effect
										key={ix}
										id={ix}
										name={primary.name}
										sourceId={Number(primary.args?.[0])}
										fullInstructions={instructions}
									/>
								)
							})}
						</div>
					</>
				)}
			</div>
		</div>
	)
}
