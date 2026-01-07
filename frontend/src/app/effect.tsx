'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useTextorContext } from './context'
import { lib } from '../static/lib'
import { defaultState, FONT_ROBOTO_MONO, fonts } from '../static/constants'
import { Instruction } from './model'
import phosphorIcons from '../static/svg/phosphorIcons'
import IconButton from '../components/buttons/IconButton'
import { gs } from '../static/instructions'
import Input from '../components/Input'
import { document_vault } from '../static/documents/system/vault'
import { dlog, log } from '../static/log'
import utils from './utils'
import Panel from '../components/Panel'
import { SafetyButton } from '../components/buttons/SafetyButton'
import RunButton from '../components/buttons/RunButton'
import { document_default } from '../static/documents/default'

import { useMemo } from 'react'
const updateTransitionMs = 150

export default function ({ id, name, sourceId, fullInstructions }: { id: number, name: string, sourceId: number, fullInstructions: Instruction[] }) {

	const instructions = useMemo(() => fullInstructions.slice(1), [fullInstructions])
	const currentInstructions = useRef(instructions)

	const { files, system, effects, vault } = useTextorContext()

	const [effectText, setEffectText] = useState<string>()
	const prevEffectText = useRef<string>(undefined)

	const [opacity, setOpacity] = useState(1)

	const textareaRef = useRef<HTMLTextAreaElement>(null)

	const [selectedEffect, setSelectedEffect] = useState<string>()

	const [effectString, setEffectString] = useState('')


	useEffect(() => {
		currentInstructions.current = instructions
		if (files.currentDocument?.name === document_vault.name && files.currentDocument?.folderName === document_vault.folderName && instructions[0].name.includes('export')) {
			const exportString = vault.prepareExport()
			if (exportString) {
				const instructions = lib.fromTextInstructions(exportString)
				const insts = instructions.slice(1) // remove name
				currentInstructions.current = insts
				setEffectString(lib.toTextInstructions(insts))
				if (!effects.isManual(id)) {
					reload()
				} else {
					updateTextWithTransition('')
				}
				return
			}
		}

		if (!effects.isManual(id)) {
			reload()
		} else {
			updateTextWithTransition('')
		}
		setEffectString(lib.toTextInstructions(instructions))
	}, [instructions, effects.reloader])

	useEffect(() => {
		if (!files.currentDocument || effects.selectedId === undefined) return
		log([dlog.tpanels], '[selectedEffectId, currentDocument]', { selectedId: effects.selectedId, effects: files.currentDocument.effects })
		let id = effects.selectedId === undefined ? 0 : effects.selectedId
		setSelectedEffect(files.currentDocument.effects[id])
	}, [files.currentDocument, effects.selectedId])

	useEffect(() => {
		log([dlog.tpanels], '[selectedEffect]', { selectedEffect })
	}, [selectedEffect])

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (effectString && effectString !== lib.toTextInstructions(instructions)) {
				if (id === effects.selectedId) {
					const header = lib.toTextInstructions([fullInstructions[0]])
					effects.updateSelected(`${header}\n${effectString}`)
				}
			}
		}, 500)
		return () => clearTimeout(timeoutId)
	}, [effectString, instructions])

	useEffect(() => {

	}, [effectText])

	useEffect(() => {
		if (opacity === 1) {
			setTimeout(() => {
				setOpacity(0)
			}, updateTransitionMs)
		} else if (opacity === 0) {

		}
	}, [opacity])

	function updateTextWithTransition(newText: string) {
		prevEffectText.current = effectText
		setOpacity(1)
		setTimeout(() => setEffectText(newText), updateTransitionMs)
	}

	function copy() {
		lib.updateEach(files.currentDocument.editor!.text, currentInstructions.current).then(updated => utils.copyToClipboard(updated))
	}

	function reload() {
		log([dlog.teffects], 'reload()', { instructions: currentInstructions.current })
		const doc = files.currentDocument
		if (!doc) return
		lib.updateEach(doc.editor!.text, currentInstructions.current).then(result => {
			console.log(result)
			const currentFolder = doc.folderName
			const currentFile = doc.name

			if (currentFolder === document_vault.folderName && currentFile === document_vault.name && currentInstructions.current[0].name.includes('import')) {
				if (!result.startsWith('Error:')) {
					vault.import(result)
					updateTextWithTransition('Vault imported - unlock with password')
				}
				else {
					updateTextWithTransition(result)
				}
			} else if (currentFolder === document_default.folderName && currentFile === document_default.name && currentInstructions.current[0].name === 'updater') {
				updateTextWithTransition(`Latest version is ${defaultState.version}
Your former User content : \n${system.documentsBackup}`)
			} else {
				updateTextWithTransition(result)
			}
		})
	}

	function idChanged(id: string) {

	}

	function nameChanged(name: string) {

	}

	function insertEffectSeparator() {
		const textarea = textareaRef.current
		if (!textarea) {
			setEffectString(prev => prev + gs)
			return
		}

		const start = textarea.selectionStart ?? effectString.length
		const end = textarea.selectionEnd ?? effectString.length
		const next = effectString.slice(0, start) + gs + effectString.slice(end)
		setEffectString(next)

		requestAnimationFrame(() => {
			textarea.setSelectionRange(start + gs.length, start + gs.length)
		})
	}

	const columns = { selected: '201px 1fr', unselected: '299px 1fr' }

	return (
		<Panel>
			<div className='effect' style={{ display: 'grid', gridTemplateColumns: id === effects.selectedId ? columns.unselected : columns.selected, background: `linear-gradient(to right, ${system.settings.colors.materialLo}, ${system.settings.colors.materialHi})`, borderRadius: 3 }}>
				<div style={{ display: 'flex', flexDirection: 'column' }}>

					{id === effects.selectedId ?
						<div style={{ display: 'flex', flexDirection: 'column', paddingRight: 2 }}>
							<div style={{ display: 'flex', width: '100%', background: system.settings.colors.inputBackground, color: system.settings.colors.dark, marginTop: 0, marginBottom: 1, borderBottomLeftRadius: 2, padding: '0px 0px 0px 0px', gap: 1 }}>
								<Input value={name} submit={nameChanged} style={{ width: '100%' }} />
								<Input value={(id + 1).toString()} submit={idChanged} style={{ width: 49, textAlign: 'right', paddingRight: 10 }} />
							</div>

							<textarea ref={textareaRef} disabled={selectedEffect === undefined}
								spellCheck={false}
								value={effectString}
								onChange={e => setEffectString(e.target.value)}
								onKeyDown={e => {
									if (e.key === '|') {
										e.preventDefault()
										insertEffectSeparator()
									}
								}}
								placeholder={'Select Effect'}
								className={fonts[FONT_ROBOTO_MONO].className}
								style={{
									background: `linear-gradient(to top, ${system.settings.colors.editorBackgroundLo}, ${system.settings.colors.editorBackgroundHi})`,
									borderBottom: `1px solid ${system.settings.colors.lightDark}`,
									borderTop: `1px solid ${system.settings.colors.effectEditorColor}`,
									resize: 'none',
									color: system.settings.colors.effectEditorColor,
									padding: '0px 2px 0px 8px',
									marginLeft: 1,
									marginBottom: 1,
									fontSize: system.settings.effectEditorFontSize,
									height: 86,
								}}
							/>

							<div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: 1 }}>
								<div style={{ display: 'flex', gap: 1, flexDirection: 'row', flex: 0 }}>
									<RunButton manual={effects.isManual(id)} api={lib.isApiEffect(instructions)} onActivate={() => reload()} />

									<IconButton onActivate={copy} icon={<phosphorIcons.CornersOut color={system.settings.colors.buttonColor} />}>copy</IconButton>
								</div>

								<SafetyButton disabled={!files.currentDocument?.deletable} onActivate={effects.deleteSelected} icons={[<phosphorIcons.Trash color={system.settings.colors.red} />, <phosphorIcons.Warning color={system.settings.colors.red} />]} captions={['delete', 'warng']} />

							</div>
						</div>
						:
						<>
							<div style={{ display: 'flex', justifyContent: 'space-between', height: 25, width: '100%', background: system.settings.colors.inputBackground, color: system.settings.colors.dark, marginTop: 0, marginBottom: 1, borderBottomLeftRadius: 2, padding: '5px 0px 0px 0px', gap: 1 }}
								onClick={() => effects.setSelectedId(id)}
							>
								<div style={{ paddingLeft: 8 }}>
									{name}
								</div>
								<div style={{ paddingRight: 9 }}>
									{id + 1}
								</div>
							</div>
							<div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: 1 }}>

								<div style={{ display: 'flex', gap: 1, flexDirection: 'row', flex: 0 }}>
									<RunButton manual={effects.isManual(id)} api={lib.isApiEffect(instructions)} onActivate={() => reload()} />
									<IconButton onActivate={copy} icon={<phosphorIcons.CornersOut color={system.settings.colors.buttonColor} />}>copy</IconButton>
								</div>
								<SafetyButton disabled={!files.currentDocument?.deletable} onActivate={effects.deleteSelected} icons={[<phosphorIcons.Trash color={system.settings.colors.red} />, <phosphorIcons.Warning color={system.settings.colors.red} />]} captions={['delete', 'warng']} />

							</div>
						</>

					}
				</div>

				<div style={{ display: 'flex', position: 'relative', paddingRight: 3, background: `linear-gradient(to top, ${system.settings.colors.editorBackgroundLo}, ${system.settings.colors.editorBackgroundHi})` }}>

					<textarea onClick={() => effects.setSelectedId(id)}
						value={effectText}
						placeholder={instructions.map(i => i.args !== undefined && i.args.length > 0 ? `${i.name}${gs}${i.args.join(gs)}` : `${i.name}`).join('\n')}
						className={fonts[FONT_ROBOTO_MONO].className}
						style={{
							overflowY: id == effects.selectedId ? 'scroll' : 'hidden',
							height: '100%',
							width: '100%',
							resize: 'none',
							// background: `linear-gradient(to top, ${system.settings.colors.editorBackgroundLo}, ${system.settings.colors.editorBackgroundHi})`,
							background: 'inherit',
							color: system.settings.colors.effectEditorColor,
							padding: '2px 12px 0px 6px',
							margin: '0px 0px 0px 2px',
						}}
						readOnly
					/>
					<div style={{
						inset: 0,
						position: 'absolute',
						background: `linear-gradient(to top, ${system.settings.colors.editorBackgroundLo}, ${system.settings.colors.editorBackgroundHi})`,
						opacity: opacity,
						transition: `opacity ${updateTransitionMs}ms ease-in-out`,
						pointerEvents: 'none'
					}}>
					</div>
				</div>
			</div>
		</Panel>
	)
} 
