import React, { useEffect, useRef, useState } from 'react'
import { useTextorContext } from '../app/context'
import { dlog, log } from '../static/log'

type EditorProps = {
	spellCheck?: boolean
}

export default function ({ spellCheck = true }: EditorProps) {

	const { editor, system } = useTextorContext()

	const editorRef = useRef<HTMLDivElement | null>(null)
	const [html, setHtml] = useState<string | undefined>()
	const [text, setText] = useState(editor.text || '')

	const styles = {
		p: 'margin-bottom: 5px;',
		hashtag: `color: ${system.settings.colors.blueAccent}; font-weight: bold;`,
	}

	useEffect(() => {
		// renderHtml(text)
		console.log('text', text)
	}, [text])

	const renderHtml = (source: string) => {
		console.log('renderHtml', source)
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
				return `<p style="${styles.p}">${withTags}</p>`
			})
			.join('')
		setHtml(result)
		return result
	}

	const insertTextAtCursor = (insertText: string) => {
		if (!editorRef.current) return false
		const selection = window.getSelection()
		if (!selection || selection.rangeCount === 0) return false
		const range = selection.getRangeAt(0)
		if (!editorRef.current.contains(range.commonAncestorContainer)) return false

		const preRange = range.cloneRange()
		preRange.selectNodeContents(editorRef.current)
		preRange.setEnd(range.startContainer, range.startOffset)
		const start = preRange.toString().length

		preRange.setEnd(range.endContainer, range.endOffset)
		const end = preRange.toString().length

		setText(prevText => {
			const nextText = `${prevText.slice(0, start)}${insertText}${prevText.slice(end)}`
			renderHtml(nextText)
			return nextText
		})
	}

	const handleInput = () => {
		if (!editorRef.current) return
		const nextText = editorRef.current.innerText

		setText(() => {
			renderHtml(nextText)
			return nextText
		})
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
			if (name !== 'insert') return
			const content = payload ?? ''
			insertTextAtCursor(content)
			editorRef.current?.focus()
			setText(prevText => {
				const nextText = `${prevText}${content}`
				renderHtml(nextText)
				return nextText
			})
		})
	}, [editor.actions])

	return (
		<div
			ref={editorRef}
			contentEditable
			spellCheck={spellCheck}
			suppressContentEditableWarning
			onInput={handleInput}
			onPaste={handlePaste}
			dangerouslySetInnerHTML={{ __html: html || '' }}
			style={{
				height: 300, width: '100%',
				padding: '5px 6px 0px 11px',
				caretColor: '#000000',
				background: `linear-gradient(to top, ${system.settings.colors.editorBackgroundLo}, ${system.settings.colors.editorBackgroundHi})`,
				color: system.settings.colors.editorColor,
				fontSize: editor.fontSize + 'pt',
				lineHeight: editor.lineHeight,
				letterSpacing: editor.letterSpacing + 'px',
				fontFamily: editor.fontFamily,
				overflowY: 'scroll',
				outline: 'none',
			}}
		/>
	)
}
