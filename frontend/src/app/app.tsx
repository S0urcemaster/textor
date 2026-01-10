import Editor from './editor'
import Head, { menuCommands } from './head'
import { useTextorContext } from './context'
import Effect from './effect'
import { useEffect, useRef, useState } from 'react'
import CharsPanel from '../panels/charsPanel'
import DocsPanel from '../panels/docsPanel'
import { InfoPanel } from '../panels/infoPanel'
import VaultPanel from '../panels/vaultPanel'
import ImagesPanel from '../panels/imagesPanel'


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
		<div className="page" style={{ background: `linear-gradient(to right, ${system.settings.colors.materialLo}, ${system.settings.colors.materialHi})`, display: 'flex', flexDirection: system.settings.horizontalLayout ? 'row' : 'column', width: system.settings.width }}>

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
		</div>
	)
}
