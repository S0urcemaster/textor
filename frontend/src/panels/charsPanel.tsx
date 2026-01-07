import { useEffect, useState } from "react"
import { useTextorContext } from "../app/context"
import { charsets } from "../static/charsets"
import { FeedbackButton } from "../components/buttons/FeedbackButton"
import Button from "../components/buttons/Button"
import { gs } from "../static/instructions"
import { dlog, log } from "../static/log"
import Panel from "../components/Panel"

export default function () {

	const { editor, system } = useTextorContext()
	const [currentMenu, setCurrentMenu] = useState(0)

	function insertChar(smiley: string): boolean {
		editor.setActions([['insert', smiley]])
		return true
	}

	return (
		<Panel>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>

				<Button key={0} isSelected={currentMenu === 0} style={{ fontSize: 20 }} onActivate={() => setCurrentMenu(0)}>{'🎒'}</Button>
				{Object.keys(charsets).map((group, ix) => (
					<Button trigger='mousedown' key={ix + 1} isSelected={currentMenu === ix + 1} style={{ fontSize: 20 }} onActivate={() => setCurrentMenu(ix + 1)}>{group}</Button>
				))}
			</div>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
				{currentMenu === 0 ?
					<>
						<Button trigger='mousedown' key={0} style={{ fontSize: 26 }} onActivate={() => insertChar('⧘')}>⧘</Button>

						{system.settings.userChars.split(gs).map((char, ix) =>
							<Button trigger='mousedown' key={ix + 1} style={{ fontSize: 26 }} onActivate={() => insertChar(char)}>{char}</Button>
						)}
					</>
					:
					Object.values(charsets)[currentMenu - 1].map((char, ix) =>
						<Button trigger='mousedown' key={ix} style={{ fontSize: 26 }} onActivate={() => insertChar(char)}>{char}</Button>
					)}
			</div>
		</Panel>
	)
}