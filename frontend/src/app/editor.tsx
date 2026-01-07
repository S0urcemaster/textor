// editor.tsx

import { CSSProperties, useEffect, useState } from 'react'
import { useTextorContext } from './context'

import { FONT_GLUTEN, FONT_NOTO_SANS, FONT_NOTO_SERIF, FONT_ROBOTO_MONO, fonts } from '../static/constants'
import { EditorContent } from './editorContent'
import { dlog, log } from '../static/log'
import Panel from '../components/Panel'
import Button from '../components/buttons/Button'
import DoubleIconButton from '../components/buttons/DoubleIconButton'
import PhosphorIcons from '../static/svg/phosphorIcons'

export default function () {
	const { editor, system } = useTextorContext()

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

	function hashtagOnChanged() {

	}

	function markdownOnChanged() {
	}

	const fontStyle: Record<string, CSSProperties> = {
		// [FONT_TINY5]: {lineHeight: 1, fontSize: 25},
		// [FONT_TRIAL]: { fontSize: 26 },
	}

	return (
		<Panel>
			<div style={{ display: 'flex', paddingTop: 1, borderRadius: 5 }}>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
					<Button style={{ display: 'flex', textAlign: 'center' }} onActivate={onFontButton} trigger='mousedown'>{fontNameReplace[editor.fontFamily] ?? 'Noto Sans'}</Button>
					<DoubleIconButton icons={['A⯅', 'A⯆']} onActivateSecond={fontSizeDown} onActivate={fontSizeUp} style={{ fontSize: 'large' }} titles={['fnt sze', 'fnt sze']} />
					<DoubleIconButton onActivateSecond={lineHeightDown} onActivate={lineHeightUp}
						icons={[<PhosphorIcons.SplitVertical size={20} color={system.settings.colors.buttonColor} />, <PhosphorIcons.ArrowsInLineVertical size={20} color={system.settings.colors.buttonColor} />]} titles={['lne hite', 'lne hite']} />
					<DoubleIconButton onActivateSecond={letterSpacingDown} onActivate={letterSpacingUp}
						icons={[<PhosphorIcons.SplitHorizontal size={20} color={system.settings.colors.buttonColor} />, <PhosphorIcons.ArrowsInLineHorizontal size={20} color={system.settings.colors.buttonColor} />]} titles={['let spce', 'let spce']} />
					{/* <SwitchButton disabled style={{ fontSize: 30 }} values={['⌗', '⌗']} value={0} colors={[settings.buttonColor,system.settings.blueColor]} timeout={500} callback={hashtagOnChanged} /> */}
					{/* <SwitchButton disabled values={['MD', 'MD']} value={0} colors={[settings.buttonColor,system.settings.blueColor]} timeout={500} callback={markdownOnChanged} /> */}
					{/* <SwitchButton disabled values={['Text\nile', 'Text\nile']} value={0} colors={[settings.buttonColor,system.settings.blueColor]} timeout={500} callback={() => { }} /> */}
				</div>
				<EditorContent />
			</div>
		</Panel>
	)
}
