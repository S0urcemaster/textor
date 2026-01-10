import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTextorContext } from '../app/context'
import { dlog, log } from '../static/log'
import utils from '../app/utils'

type EditorProps = {
	spellCheck?: boolean
}

export default function ({ spellCheck = true }: EditorProps) {

	const { editor, system } = useTextorContext()

	const editorRef = useRef<HTMLDivElement | null>(null)
	const [html, setHtml] = useState<string | undefined>()
	const [text, setText] = useState(editor.text || '')
	const pendingSelectionRef = useRef<{ start: number, end: number } | null>(null)

	const styles = {
		p: 'margin-bottom: 5px;',
		hashtag: `color: ${system.settings.colors.blueAccent}; font-weight: bold;`,
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

	const buildHtml = (source: string) => {
		const escapeHtml = (value: string) =>
			value
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#039;')

		const tagRegex = /(^|\s)(#[A-Za-z0-9_]+)/g
		const lines = source.split(/\r?\n/)
		const result = lines
			.map(line => {
				const escaped = escapeHtml(line)
				const withTags = escaped.replace(tagRegex, `$1<span style="${styles.hashtag}">$2</span>`)
				const content = withTags === '' ? '&#8203;' : withTags
				return `<span style="${styles.p}">${content}</span>`
			})
			.join('<br>')
		return result
	}

	const getSelectionOffsets = () => {
		if (!editorRef.current) return null
		const selection = window.getSelection()
		if (!selection || selection.rangeCount === 0) return null
		const range = selection.getRangeAt(0)
		if (!editorRef.current.contains(range.commonAncestorContainer)) return null
		const start = offsetFromPosition(editorRef.current, range.startContainer, range.startOffset)
		const end = offsetFromPosition(editorRef.current, range.endContainer, range.endOffset)
		return { start, end }
	}

	const findPositionInNode = (node: Node, offset: number) => {
		const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT)
		let current: Node | null = walker.nextNode()
		let remaining = offset
		while (current) {
			const len = current.textContent?.length ?? 0
			if (remaining <= len) {
				return { node: current, offset: remaining }
			}
			remaining -= len
			current = walker.nextNode()
		}
		return { node, offset: 0 }
	}

	const nodeTextLength = (node: Node): number => {
		if (node.nodeType === Node.TEXT_NODE) {
			return node.textContent?.length ?? 0
		}
		if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'BR') {
			return 1
		}
		let total = 0
		for (const child of Array.from(node.childNodes)) {
			total += nodeTextLength(child)
		}
		return total
	}

	const offsetFromPosition = (root: HTMLElement, node: Node, offset: number) => {
		let total = 0
		const walk = (current: Node): boolean => {
			if (current === node) {
				if (current.nodeType === Node.TEXT_NODE) {
					total += offset
				} else {
					const children = Array.from(current.childNodes)
					for (let i = 0; i < Math.min(offset, children.length); i++) {
						total += nodeTextLength(children[i])
					}
				}
				return true
			}
			if (current.nodeType === Node.TEXT_NODE) {
				total += current.textContent?.length ?? 0
				return false
			}
			if (current.nodeType === Node.ELEMENT_NODE && (current as HTMLElement).tagName === 'BR') {
				total += 1
				return false
			}
			for (const child of Array.from(current.childNodes)) {
				if (walk(child)) return true
			}
			return false
		}
		walk(root)
		return total
	}

	const resolveSelectionPoint = (root: HTMLElement, offset: number) => {
		const nodes = Array.from(root.childNodes)
		if (nodes.length === 0) {
			return { node: root, offset: 0 }
		}
		let remaining = offset
		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i]
			if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'BR') {
				if (remaining <= 1) {
					const nextNode = nodes[i + 1]
					if (nextNode) {
						return findPositionInNode(nextNode, 0)
					}
					return { node: root, offset: nodes.length }
				}
				remaining -= 1
				continue
			}
			const len = node.textContent?.length ?? 0
			if (remaining <= len) {
				return findPositionInNode(node, remaining)
			}
			remaining -= len
		}
		const last = nodes[nodes.length - 1]
		return { node: last, offset: last.childNodes.length }
	}

	const restoreSelectionOffsets = (offsets: { start: number, end: number }) => {
		if (!editorRef.current) return
		const selection = window.getSelection()
		if (!selection) return
		const anchor = resolveSelectionPoint(editorRef.current, offsets.start)
		const head = resolveSelectionPoint(editorRef.current, offsets.end)
		const range = document.createRange()
		range.setStart(anchor.node, anchor.offset)
		range.setEnd(head.node, head.offset)
		selection.removeAllRanges()
		selection.addRange(range)
	}

	const updateHtmlFromText = (source: string, preserveSelection = true) => {
		if (preserveSelection) {
			pendingSelectionRef.current = getSelectionOffsets()
		}
		setHtml(buildHtml(source))
	}

	useLayoutEffect(() => {
		if (!pendingSelectionRef.current) return
		restoreSelectionOffsets(pendingSelectionRef.current)
		pendingSelectionRef.current = null
	}, [html])

	const insertTextAtCursor = (insertText: string) => {
		if (!editorRef.current) return false
		const selection = window.getSelection()
		if (!selection || selection.rangeCount === 0) return false
		const range = selection.getRangeAt(0)
		if (!editorRef.current.contains(range.commonAncestorContainer)) return false
		const offsets = getSelectionOffsets()
		if (!offsets) return false
		const { start, end } = offsets

		setText(prevText => {
			const nextText = `${prevText.slice(0, start)}${insertText}${prevText.slice(end)}`
			pendingSelectionRef.current = {
				start: start + insertText.length,
				end: start + insertText.length
			}
			setHtml(buildHtml(nextText))
			editor.setText(nextText)
			return nextText
		})
	}

	const getPlainText = (root: HTMLElement) => {
		let out = ''
		const walk = (node: Node) => {
			if (node.nodeType === Node.TEXT_NODE) {
				const value = node.textContent ?? ''
				out += value.replace(/\u200B/g, '')
				return
			}
			if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'BR') {
				out += '\n'
				return
			}
			for (const child of Array.from(node.childNodes)) {
				walk(child)
			}
		}
		walk(root)
		return out
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
