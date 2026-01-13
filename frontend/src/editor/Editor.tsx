import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTextorContext } from '../app/context'
import { dlog, log } from '../static/log'
import utils from '../app/utils'
import { buildEditorHtml, EditorHtmlStyles } from './html'
import { getSelectionOffsets, nodeTextLength, findPositionInNode, restoreSelectionOffsets, SelectionOffsets } from './selection'
import { getPlainText } from './text'

type EditorProps = {
	spellCheck?: boolean
}

export default function ({ spellCheck = true }: EditorProps) {

	const { editor, system } = useTextorContext()

	const editorRef = useRef<HTMLDivElement | null>(null)
	const [html, setHtml] = useState<string | undefined>()
	const [text, setText] = useState(editor.text || '')
	const pendingSelectionRef = useRef<SelectionOffsets | null>(null)
	const pendingFocusRef = useRef(false)
	const historyRef = useRef<{ text: string; selection: SelectionOffsets | null }[]>([
		{ text: editor.text || '', selection: null }
	])
	const historyIndexRef = useRef(0)
	const isHistoryNavRef = useRef(false)

	const useTagOutline = false

	const styles: EditorHtmlStyles = {
		paragraph: 'margin-bottom: 10px; display: inline-block; width: 100%; padding-left: 13px; text-indent: -13px;',
		paragraphSoft: 'display: inline-block; width: 100%; padding-left: 13px; text-indent: -13px;',
		hashtag: `color: ${system.settings.contrast ? system.settings.colors.editorHashtagColorDark : system.settings.colors.editorHashtagColorLight}; font-weight: bold;${useTagOutline ? ' text-shadow: -0.5px 0 #444444, 0.5px 0 #444444, 0 -0.5px #444444, 0 0.5px #444444;' : ''}`,
		attag: `color: ${system.settings.contrast ? system.settings.colors.editorAttagColorDark : system.settings.colors.editorAttagColorLight}; font-weight: bold;${useTagOutline ? ' text-shadow: -0.5px 0 #444444, 0.5px 0 #444444, 0 -0.5px #444444, 0 0.5px #444444;' : ''}`,
	}

	useEffect(() => {
		const next = editor.text ?? ''
		if (next !== text) {
			setText(next)
			updateHtmlFromText(next, false)
			historyRef.current = [{ text: next, selection: null }]
			historyIndexRef.current = 0
		} else if (html == null) {
			updateHtmlFromText(next, false)
		}
	}, [editor.text])

	useEffect(() => {
		if (html == null) return
		updateHtmlFromText(text)
	}, [
		system.settings.contrast,
		system.settings.colors.editorHashtagColorLight,
		system.settings.colors.editorHashtagColorDark,
		system.settings.colors.editorAttagColorLight,
		system.settings.colors.editorAttagColorDark,
		useTagOutline
	])

	const updateHtmlFromText = (source: string, preserveSelection = true) => {
		// Keep caret/selection stable across rebuilds of innerHTML.
		if (preserveSelection) {
			pendingSelectionRef.current = editorRef.current ? getSelectionOffsets(editorRef.current) : null
			pendingFocusRef.current = !!editorRef.current && document.activeElement === editorRef.current
		}
		setHtml(buildEditorHtml(source, styles))
	}

	useLayoutEffect(() => {
		if (!pendingSelectionRef.current || !editorRef.current) return
		restoreSelectionOffsets(editorRef.current, pendingSelectionRef.current)
		if (pendingFocusRef.current) {
			editorRef.current.focus()
		}
		pendingSelectionRef.current = null
		pendingFocusRef.current = false
	}, [html])

	const pushHistory = (nextText: string, selection: SelectionOffsets | null) => {
		if (isHistoryNavRef.current) return
		const history = historyRef.current
		const current = history[historyIndexRef.current]
		if (current && current.text === nextText) {
			history[historyIndexRef.current] = { text: nextText, selection }
			return
		}
		const nextIndex = historyIndexRef.current + 1
		historyRef.current = history.slice(0, nextIndex)
		historyRef.current.push({ text: nextText, selection })
		historyIndexRef.current = historyRef.current.length - 1
	}

	const applyHistoryEntry = (entry: { text: string; selection: SelectionOffsets | null }) => {
		const selection = entry.selection ?? { start: entry.text.length, end: entry.text.length }
		isHistoryNavRef.current = true
		pendingSelectionRef.current = selection
		pendingFocusRef.current = true
		setText(entry.text)
		setHtml(buildEditorHtml(entry.text, styles))
		editor.setText(entry.text)
		isHistoryNavRef.current = false
	}

	const undo = () => {
		const nextIndex = historyIndexRef.current - 1
		if (nextIndex < 0) return
		historyIndexRef.current = nextIndex
		const entry = historyRef.current[nextIndex]
		if (entry) applyHistoryEntry(entry)
	}

	const redo = () => {
		const nextIndex = historyIndexRef.current + 1
		if (nextIndex >= historyRef.current.length) return
		historyIndexRef.current = nextIndex
		const entry = historyRef.current[nextIndex]
		if (entry) applyHistoryEntry(entry)
	}

	const insertTextAtCursor = (insertText: string, forcedOffsets?: SelectionOffsets | null) => {
		if (!editorRef.current) return false
		const offsets = forcedOffsets ?? (() => {
			const selection = window.getSelection()
			const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null
			return editorRef.current && range
				&& editorRef.current.contains(range.startContainer)
				&& editorRef.current.contains(range.endContainer)
				? getSelectionOffsets(editorRef.current)
				: null
		})()

		setText(prevText => {
			const { start, end } = offsets ?? { start: prevText.length, end: prevText.length }
			const nextText = `${prevText.slice(0, start)}${insertText}${prevText.slice(end)}`
			const nextSelection = {
				start: start + insertText.length,
				end: start + insertText.length
			}
			pendingSelectionRef.current = nextSelection
			pendingFocusRef.current = true
			if (nextText === prevText && editorRef.current) {
				restoreSelectionOffsets(editorRef.current, nextSelection)
				editorRef.current.focus()
				pushHistory(nextText, nextSelection)
				return prevText
			}
			setHtml(buildEditorHtml(nextText, styles))
			editor.setText(nextText)
			pushHistory(nextText, nextSelection)
			return nextText
		})
	}

	const getCurrentText = () => {
		if (editorRef.current) {
			return getPlainText(editorRef.current).replace(/\r\n/g, '\n')
		}
		return text
	}

	const handleInput = () => {
		if (!editorRef.current) return
		const nextText = getPlainText(editorRef.current).replace(/\r\n/g, '\n')
		const selection = getSelectionOffsets(editorRef.current)

		setText(() => {
			updateHtmlFromText(nextText)
			editor.setText(nextText)
			pushHistory(nextText, selection)
			return nextText
		})
	}

	const handleBeforeInput = (event: React.FormEvent<HTMLDivElement>) => {
		const inputEvent = event.nativeEvent as InputEvent
		if (inputEvent.inputType === 'historyUndo') {
			inputEvent.preventDefault()
			undo()
			return
		}
		if (inputEvent.inputType === 'historyRedo') {
			inputEvent.preventDefault()
			redo()
			return
		}
		if (inputEvent.inputType === 'insertParagraph') {
			inputEvent.preventDefault()
			insertTextAtCursor('\n')
			return
		}
		if (inputEvent.inputType === 'insertLineBreak') {
			inputEvent.preventDefault()
			insertTextAtCursor('\v')
			return
		}
		if (inputEvent.inputType === 'insertText' && inputEvent.data === '.') {
			console.log(event)
			inputEvent.preventDefault()
			insertTextAtCursor('·')
		}
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Tab' && !event.ctrlKey && !event.metaKey && !event.altKey) {
			event.preventDefault()
			insertTextAtCursor('\t')
			return
		}
		if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
			event.preventDefault()
			if (event.shiftKey) {
				redo()
			} else {
				undo()
			}
			return
		}
		if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
			event.preventDefault()
			redo()
			return
		}
		if (event.key === 'Backspace') {
			const offsets = editorRef.current ? getSelectionOffsets(editorRef.current) : null
			if (offsets && offsets.start === offsets.end && offsets.start > 0) {
				const current = getCurrentText()
				if (current[offsets.start - 1] === '\n' || current[offsets.start - 1] === '\v') {
					event.preventDefault()
					const nextText = `${current.slice(0, offsets.start - 1)}${current.slice(offsets.end)}`
					const nextSelection = {
						start: offsets.start - 1,
						end: offsets.start - 1,
					}
					pendingSelectionRef.current = nextSelection
					pendingFocusRef.current = true
					setText(nextText)
					setHtml(buildEditorHtml(nextText, styles))
					editor.setText(nextText)
					pushHistory(nextText, nextSelection)
					return
				}
			}
		}
		if (event.key === 'Delete') {
			const offsets = editorRef.current ? getSelectionOffsets(editorRef.current) : null
			if (offsets && offsets.start === offsets.end) {
				const current = getCurrentText()
				if (current[offsets.start] === '\n' || current[offsets.start] === '\v') {
					event.preventDefault()
					const nextText = `${current.slice(0, offsets.start)}${current.slice(offsets.end + 1)}`
					const nextSelection = {
						start: offsets.start,
						end: offsets.start,
					}
					pendingSelectionRef.current = nextSelection
					pendingFocusRef.current = true
					setText(nextText)
					setHtml(buildEditorHtml(nextText, styles))
					editor.setText(nextText)
					pushHistory(nextText, nextSelection)
					return
				}
			}
		}
		if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
			const selection = window.getSelection()
			if (selection?.isCollapsed && selection.anchorNode?.nodeType === Node.TEXT_NODE) {
				const anchorText = selection.anchorNode.textContent ?? ''
				if (anchorText === '\u200B' && selection.anchorNode.parentNode) {
					const parent = selection.anchorNode.parentNode
					const sibling = event.key === 'ArrowRight' ? parent.nextSibling : parent.previousSibling
					if (sibling?.nodeType === Node.ELEMENT_NODE && (sibling as HTMLElement).tagName === 'BR') {
						const target = event.key === 'ArrowRight' ? sibling.nextSibling : sibling.previousSibling
						if (target && editorRef.current) {
							event.preventDefault()
							const nextPos = findPositionInNode(target, event.key === 'ArrowRight' ? 0 : nodeTextLength(target))
							const range = document.createRange()
							range.setStart(nextPos.node, nextPos.offset)
							range.collapse(true)
							selection.removeAllRanges()
							selection.addRange(range)
							return
						}
						if (editorRef.current) {
							event.preventDefault()
							const range = document.createRange()
							range.setStart(editorRef.current, event.key === 'ArrowRight' ? editorRef.current.childNodes.length : 0)
							range.collapse(true)
							selection.removeAllRanges()
							selection.addRange(range)
							return
						}
					}
				}
			}
		}
		if (event.key === 'Enter' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
			event.preventDefault()
			insertTextAtCursor('\n')
			return
		}
		if (event.key === 'Enter' && event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey) {
			event.preventDefault()
			insertTextAtCursor('\v')
			return
		}
		if (event.key === '.' && !event.ctrlKey && !event.metaKey && !event.altKey) {
			event.preventDefault()
			insertTextAtCursor('·')
		}
	}

	const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
		event.preventDefault()
		const offsets = editorRef.current ? getSelectionOffsets(editorRef.current) : null
		const text = event.clipboardData.getData('text/plain')
		insertTextAtCursor(text, offsets)
	}

	useEffect(() => {
		log([dlog.teditor], '[editor.actions]', { actions: editor.actions })
		if (!editor.actions || editor.actions.length === 0) return
		editor.actions.forEach(([name, payload]) => {
			switch (name) {
				case 'insert': {
					const content = payload ?? ''
					editorRef.current?.focus()
					insertTextAtCursor(content)
					break
				}
				case 'clear': {
					setText('')
					updateHtmlFromText('', false)
					editor.setText('')
					editorRef.current?.focus()
					break
				}
				case 'copy': {
					const current = getCurrentText()
					utils.copyToClipboard(current)
					break
				}
			}
		})
	}, [editor.actions])

	return (
		<div
			ref={editorRef}
			contentEditable
			data-interactive="true"
			spellCheck={spellCheck}
			suppressContentEditableWarning
			onBeforeInput={handleBeforeInput}
			onKeyDown={handleKeyDown}
			onInput={handleInput}
			onPaste={handlePaste}
			dangerouslySetInnerHTML={{ __html: html || '' }}
			style={{
				height: system.settings.horizontalLayout ? document.body.getBoundingClientRect().height - 75 : '300px', width: '100%',
				padding: '5px 6px 0px 11px',
				caretColor: '#000000',
				background: `linear-gradient(to top, ${system.settings.contrast ? system.settings.colors.editorBackgroundLoDark : system.settings.colors.editorBackgroundLoLight}, ${system.settings.contrast ? system.settings.colors.editorBackgroundHiDark : system.settings.colors.editorBackgroundHiLight})`,
				border: system.settings.contrast ? 'none' : `1px solid ${system.settings.colors.materialMedian}`,
				color: system.settings.contrast ? system.settings.colors.editorColorDark : system.settings.colors.editorColorLight,
				fontSize: editor.fontSize + 'pt',
				lineHeight: editor.lineHeight,
				letterSpacing: editor.letterSpacing + 'px',
				fontFamily: editor.fontFamily,
				whiteSpace: 'pre-wrap',
				overflowY: 'scroll',
				outline: 'none',
			}}
		/>
	)
}
