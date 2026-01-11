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

	const styles: EditorHtmlStyles = {
		paragraph: 'margin-bottom: 10px; display: inline-block; width: 100%; padding-left: 13px; text-indent: -13px;',
		hashtag: `color: ${system.settings.colors.blueAccent}; font-weight: bold; text-shadow: -0.5px 0 #444444, 0.5px 0 #444444, 0 -0.5px #444444, 0 0.5px #444444;`,
		attag: `color: ${system.settings.colors.blueAccent}; font-weight: bold; text-shadow: -0.5px 0 #444444, 0.5px 0 #444444, 0 -0.5px #444444, 0 0.5px #444444;`,
	}

	useEffect(() => {
		const next = editor.text ?? ''
		if (next !== text) {
			setText(next)
			updateHtmlFromText(next, false)
		} else if (html == null) {
			updateHtmlFromText(next, false)
		}
	}, [editor.text])

	const updateHtmlFromText = (source: string, preserveSelection = true) => {
		// Keep caret/selection stable across rebuilds of innerHTML.
		if (preserveSelection) {
			pendingSelectionRef.current = editorRef.current ? getSelectionOffsets(editorRef.current) : null
		}
		setHtml(buildEditorHtml(source, styles))
	}

	useLayoutEffect(() => {
		if (!pendingSelectionRef.current || !editorRef.current) return
		restoreSelectionOffsets(editorRef.current, pendingSelectionRef.current)
		pendingSelectionRef.current = null
	}, [html])

	const insertTextAtCursor = (insertText: string) => {
		if (!editorRef.current) return false
		const selection = window.getSelection()
		if (!selection || selection.rangeCount === 0) return false
		const range = selection.getRangeAt(0)
		if (!editorRef.current.contains(range.commonAncestorContainer)) return false
		const offsets = editorRef.current ? getSelectionOffsets(editorRef.current) : null
		if (!offsets) return false
		const { start, end } = offsets

		setText(prevText => {
			const nextText = `${prevText.slice(0, start)}${insertText}${prevText.slice(end)}`
			pendingSelectionRef.current = {
				start: start + insertText.length,
				end: start + insertText.length
			}
			setHtml(buildEditorHtml(nextText, styles))
			editor.setText(nextText)
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

		setText(() => {
			updateHtmlFromText(nextText)
			editor.setText(nextText)
			return nextText
		})
	}

	const handleBeforeInput = (event: React.FormEvent<HTMLDivElement>) => {
		const inputEvent = event.nativeEvent as InputEvent
		if (inputEvent.inputType === 'insertParagraph' || inputEvent.inputType === 'insertLineBreak') {
			inputEvent.preventDefault()
			insertTextAtCursor('\n')
			return
		}
		if (inputEvent.inputType === 'insertText' && inputEvent.data === '.') {
			console.log(event)
			inputEvent.preventDefault()
			insertTextAtCursor('·')
		}
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Backspace') {
			const offsets = editorRef.current ? getSelectionOffsets(editorRef.current) : null
			if (offsets && offsets.start === offsets.end && offsets.start > 0) {
				const current = getCurrentText()
				if (current[offsets.start - 1] === '\n') {
					event.preventDefault()
					const nextText = `${current.slice(0, offsets.start - 1)}${current.slice(offsets.end)}`
					pendingSelectionRef.current = {
						start: offsets.start - 1,
						end: offsets.start - 1,
					}
					setText(nextText)
					setHtml(buildEditorHtml(nextText, styles))
					editor.setText(nextText)
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
		if (event.key === 'Enter' && !event.ctrlKey && !event.metaKey && !event.altKey) {
			event.preventDefault()
			insertTextAtCursor('\n')
			return
		}
		if (event.key === '.' && !event.ctrlKey && !event.metaKey && !event.altKey) {
			event.preventDefault()
			insertTextAtCursor('·')
		}
	}

	const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
		event.preventDefault()
		const text = event.clipboardData.getData('text/plain')
		insertTextAtCursor(text)
	}

	useEffect(() => {
		log([dlog.teditor], '[editor.actions]', { actions: editor.actions })
		if (!editor.actions || editor.actions.length === 0) return
		editor.actions.forEach(([name, payload]) => {
			switch (name) {
				case 'insert': {
					const content = payload ?? ''
					insertTextAtCursor(content)
					editorRef.current?.focus()
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
				background: `linear-gradient(to top, ${system.settings.colors.editorBackgroundLo}, ${system.settings.colors.editorBackgroundHi})`,
				color: system.settings.colors.editorColor,
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
