// editor.tsx

import { CSSProperties, useEffect, useState } from 'react'
import { useTextorContext } from './context'

import { FONT_GLUTEN, FONT_NOTO_SANS, FONT_NOTO_SERIF, FONT_ROBOTO_MONO, fonts } from '../static/constants'
import { dlog, log } from '../static/log'
import Panel from '../components/Panel'
import Button from '../components/buttons/Button'
import DoubleIconButton from '../components/buttons/DoubleIconButton'
import ToggleButton from '../components/buttons/ToggleButton'
import PhosphorIcons from '../static/svg/phosphorIcons'
import Editor from '../editor/Editor'
import phosphorIcons from '../static/svg/phosphorIcons'

const editorMenu = {
	font: 'Font',
	display: 'Editor',
}

export default function () {
	const { editor, system } = useTextorContext()
	const spellCheck = system.settings.spellCheck ?? true
	const [currentEditorMenu, setCurrentEditorMenu] = useState<keyof typeof editorMenu>('font')

	const fontNameReplace: Record<string, string> = {
		[FONT_NOTO_SANS]: 'Noto Sans',
		[FONT_NOTO_SERIF]: 'Noto Serif',
		[FONT_ROBOTO_MONO]: 'Rob\noto',
		[FONT_GLUTEN]: 'Glu\nten',
	}

	useEffect(() => {
		log([dlog.teditor], '[editor.font.family]', editor.fontFamily)
	}, [editor.fontFamily])

	function onFontButton() {
		editor.nextFamily()
		log([dlog.tbuttons], 'onFontButton()', {})
	}

	function onEditorMenuSwitch() {
		setCurrentEditorMenu((menu) => (menu === 'font' ? 'display' : 'font'))
	}

	function fontSizeUp() {
		editor.fontSizeUp()
	}

	function fontSizeDown() {
		editor.fontSizeDown()
	}

	function lineHeightUp() {
		editor.lineHeightUp()
	}

	function lineHeightDown() {
		editor.lineHeightDown()
	}

	function letterSpacingUp() {
		editor.letterSpacingUp()
	}

	function letterSpacingDown() {
		editor.letterSpacingDown()
	}

	const editorPane = <Editor spellCheck={spellCheck} />
	const controlsPane = (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
			<Button style={{ display: 'flex', textAlign: 'center' }} onActivate={onEditorMenuSwitch} trigger='mousedown'>{editorMenu[currentEditorMenu]}</Button>
			{currentEditorMenu === 'font' ? (
				<div style={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
					<Button style={{ display: 'flex', textAlign: 'center' }} onActivate={onFontButton} trigger='mousedown'>{fontNameReplace[editor.fontFamily] ?? 'Noto Sans'}</Button>
					<DoubleIconButton icons={['A⯅', 'A⯆']} onActivateSecond={fontSizeDown} onActivate={fontSizeUp} style={{ fontSize: 'large' }} titles={['fnt sze', 'fnt sze']} />
					<DoubleIconButton onActivateSecond={lineHeightDown} onActivate={lineHeightUp}
						icons={[<PhosphorIcons.SplitVertical size={20} color={system.settings.colors.buttonColor} />, <PhosphorIcons.ArrowsInLineVertical size={20} color={system.settings.colors.buttonColor} />]} titles={['lne hite', 'lne hite']} />
					<DoubleIconButton onActivateSecond={letterSpacingDown} onActivate={letterSpacingUp}
						icons={[<PhosphorIcons.SplitHorizontal size={20} color={system.settings.colors.buttonColor} />, <PhosphorIcons.ArrowsInLineHorizontal size={20} color={system.settings.colors.buttonColor} />]} titles={['let spce', 'let spce']} />
				</div>
			) : (
				<div style={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
					<ToggleButton
						title='spel chk'
						value={spellCheck}
						onToggle={(value) => system.updateSettings({ spellCheck: value })}
						icons={[
							<PhosphorIcons.EyeClosed color={system.settings.colors.buttonColor} />,
							<PhosphorIcons.Eye color={system.settings.colors.buttonColor} />
						]}
					/>
					<ToggleButton
						title='contrst'
						value={system.settings.contrast}
						onToggle={(value) => system.updateSettings({ contrast: value })}
						icons={[
							<PhosphorIcons.Sun color={system.settings.colors.buttonColor} />,
							<PhosphorIcons.Moon color={system.settings.colors.buttonColor} />
						]}
					/>
					<ToggleButton
						title="layout"
						value={system.settings.horizontalLayout}
						onToggle={() => system.updateSettings({ horizontalLayout: !system.settings.horizontalLayout })}
						icons={[
							<phosphorIcons.SplitVertical color={system.settings.colors.buttonColor} />,
							<phosphorIcons.SplitHorizontal color={system.settings.colors.buttonColor} />
						]}
					/>
				</div>
			)}
		</div>
	)

	return (
		<Panel>
			<div style={{ display: 'flex' }}>
				{system.settings.horizontalLayout ? editorPane : controlsPane}
				{system.settings.horizontalLayout ? controlsPane : editorPane}
			</div>
		</Panel>
	)
}
