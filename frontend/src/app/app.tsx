'use client'
import Editor from './editor'
import Head, { menuCommands } from './head'
import { useTextorContext } from './context'
import Effect from './effect'
import { useState } from 'react'
import CharsPanel from '../panels/charsPanel'
import DocsPanel from '../panels/docsPanel'
import { InfoPanel } from '../panels/infoPanel'
import VaultPanel from '../panels/vaultPanel'
import ImagesPanel from '../panels/imagesPanel'


export default function () {

	const { effects } = useTextorContext()
	const [currentMenu, setCurrentMenu] = useState(menuCommands.chars)
	const [menuVisible, setMenuVisible] = useState(true)

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
		<div style={{ display: 'flex', flexDirection: 'column' }}>

			<Editor />

			<Head menuClicked={menuClicked} />

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
	)
}
