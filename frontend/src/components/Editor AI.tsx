import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTextorContext } from '../app/context'
import { settings_default_light } from '../static/themes/default_light'

const colors = settings_default_light.colors

type Token =
	| { kind: 'text'; value: string }
	| { kind: 'hashtag'; value: string }
	| { kind: 'bold'; value: string }
	| { kind: 'italic'; value: string }
	| { kind: 'image'; alt: string; src: string }

function escapeHtml(s: string) {
	return s
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#039;')
}

function tokenize(input: string): Token[] {
	const tokens: Token[] = []
	let i = 0

	const pushText = (value: string) => {
		if (!value) return
		tokens.push({ kind: 'text', value })
	}

	const isHashtagChar = (ch: string) => /[A-Za-z0-9_]/.test(ch)

	while (i < input.length) {
		// Bold: **text**
		if (input.startsWith('**', i)) {
			const end = input.indexOf('**', i + 2)
			if (end !== -1) {
				const value = input.slice(i + 2, end)
				tokens.push({ kind: 'bold', value })
				i = end + 2
				continue
			}
		}

		// Italic: _text_ (simple, no escapes)
		if (input[i] === '_') {
			const end = input.indexOf('_', i + 1)
			if (end !== -1) {
				const value = input.slice(i + 1, end)
				tokens.push({ kind: 'italic', value })
				i = end + 1
				continue
			}
		}

		// Hashtag: #word (nur wenn am Anfang oder nach Whitespace)
		if (
			input[i] === '#' &&
			(i === 0 || /\s/.test(input[i - 1]))
		) {
			let j = i + 1
			while (j < input.length && isHashtagChar(input[j])) {
				j += 1
			}
			if (j > i + 1) {
				tokens.push({ kind: 'hashtag', value: input.slice(i, j) })
				i = j
				continue
			}
		}

		// Fallback: normaler Text bis zum nächsten „Spezial“
		const nextSpecials = [
			input.indexOf('**', i),
			input.indexOf('_', i),
			input.indexOf('#', i),
		].filter(n => n !== -1)

		const next = nextSpecials.length ? Math.min(...nextSpecials) : -1
		if (next === -1) {
			pushText(input.slice(i))
			break
		} else if (next === i) {
			pushText(input[i])
			i += 1
		} else {
			pushText(input.slice(i, next))
			i = next
		}
	}

	return tokens
}

function renderTokensToHtml(tokens: Token[]) {
	const parts: string[] = []

	for (const t of tokens) {
		if (t.kind === 'text') {
			parts.push(escapeHtml(t.value))
			continue
		}
		if (t.kind === 'hashtag') {
			parts.push(
				`<span style="color:${colors.blueAccent};text-shadow:0.4px 0.4px 0.4px ${colors.blueAccent};">${escapeHtml(t.value)}</span>`
			)
			continue
		}
		if (t.kind === 'bold') {
			parts.push(
				`<strong style="font-weight:800;">${escapeHtml(t.value)}</strong>`
			)
			continue
		}
		if (t.kind === 'italic') {
			parts.push(
				`<em style="font-style:italic;opacity:0.95;">${escapeHtml(t.value)}</em>`
			)
			continue
		}
	}

	return parts.join('')
}

export default function () {
	const { editor } = useTextorContext()
	const [text, setText] = useState(
		editor.text
	)
	const [overlayScrollbarPad, setOverlayScrollbarPad] = useState(0)

	const editableRef = useRef<HTMLDivElement | null>(null)
	const overlayRef = useRef<HTMLDivElement | null>(null)

	const isComposingRef = useRef(false)

	const tokens = useMemo(() => tokenize(text), [text])
	const overlayHtml = useMemo(() => renderTokensToHtml(tokens), [tokens])

	const syncScroll = () => {
		const ta = editableRef.current
		const ov = overlayRef.current
		if (!ta || !ov) return
		ov.scrollTop = ta.scrollTop
		ov.scrollLeft = ta.scrollLeft
	}

	const updateOverlayScrollbarPad = () => {
		const ta = editableRef.current
		if (!ta) return
		const scrollbarWidth = ta.offsetWidth - ta.clientWidth
		setOverlayScrollbarPad(scrollbarWidth)
	}

	useEffect(() => {
		syncScroll()
	}, [overlayHtml])

	useEffect(() => {
		updateOverlayScrollbarPad()
		window.addEventListener('resize', updateOverlayScrollbarPad)
		return () => window.removeEventListener('resize', updateOverlayScrollbarPad)
	}, [])

	useEffect(() => {
		updateOverlayScrollbarPad()
	}, [overlayHtml])

	const onInput = (e: React.FormEvent<HTMLDivElement>) => {
		// während IME-Komposition: nicht unnötig rumfummeln
		const value = e.currentTarget.textContent ?? ''
		setText(value)
	}

	const insertTextAtCursor = (value: string) => {
		const selection = window.getSelection()
		if (!selection || selection.rangeCount === 0) return
		const range = selection.getRangeAt(0)
		range.deleteContents()
		const textNode = document.createTextNode(value)
		range.insertNode(textNode)
		range.setStartAfter(textNode)
		range.setEndAfter(textNode)
		selection.removeAllRanges()
		selection.addRange(range)
	}

	const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		// Beispiel: Tab als Einrückung
		if (e.key === 'Tab') {
			e.preventDefault()
			insertTextAtCursor('  ')
			requestAnimationFrame(() => {
				const value = editableRef.current?.textContent ?? ''
				setText(value)
			})
		}
	}

	const onContainerMouseDown = () => {
		// Klick aufs Overlay soll den Fokus ins textarea werfen
		editableRef.current?.focus()
	}

	useEffect(() => {
		if (isComposingRef.current) return
		const el = editableRef.current
		if (!el) return
		const current = el.textContent ?? ''
		if (current !== text) {
			el.textContent = text
		}
	}, [text])

	return (
		<div
			style={{
				height: 300,
				width: '100%',
				display: 'flex',
				background: `linear-gradient(to top, ${colors.editorBackgroundLo}, ${colors.editorBackgroundHi})`,
				color: colors.editorColor,
				fontFamily: editor.fontFamily,
				fontSize: editor.fontSize,
				lineHeight: editor.lineHeight,
				letterSpacing: editor.letterSpacing,
			}}
		>

			<div
				style={{
					position: 'relative',
					width: '100%',
				}}
				onMouseDown={onContainerMouseDown}
			>
				<div
					ref={overlayRef}
					style={{
						position: 'absolute',
						inset: 0,
						paddingTop: 14,
						paddingRight: 14 + overlayScrollbarPad,
						paddingBottom: 14,
						paddingLeft: 14,
						overflow: 'hidden',
						whiteSpace: 'pre-wrap',
						wordBreak: 'break-word',
						color: colors.blueAccent,
						boxSizing: 'border-box',
						fontFamily: editor.fontFamily,
						fontSize: editor.fontSize,
						lineHeight: editor.lineHeight,
						letterSpacing: editor.letterSpacing,
						pointerEvents: 'none',
					}}
					// pre-wrap für Umbrüche wie textarea
					dangerouslySetInnerHTML={{
						__html: overlayHtml.replaceAll('\n', '<br/>'),
					}}
				/>

				<div
					ref={editableRef}
					style={{
						position: 'absolute',
						inset: 0,
						width: '100%',
						height: '100%',
						padding: 14,
						border: 0,
						outline: 'none',
						background: 'transparent',
						color: 'transparent',
						caretColor: colors.editorColor,
						boxSizing: 'border-box',
						overflow: 'auto',
						whiteSpace: 'pre-wrap',
						wordBreak: 'break-word',
						fontFamily: editor.fontFamily,
						fontSize: editor.fontSize,
						lineHeight: editor.lineHeight,
						letterSpacing: editor.letterSpacing,
					}}
					contentEditable
					role="textbox"
					aria-multiline="true"
					suppressContentEditableWarning
					onInput={onInput}
					onScroll={syncScroll}
					onKeyDown={onKeyDown}
					onCompositionStart={() => {
						isComposingRef.current = true
					}}
					onCompositionEnd={() => {
						isComposingRef.current = false
					}}
					spellCheck
				/>
			</div>
		</div>
	)
}
