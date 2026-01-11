import { textLength } from './text'
// AI : Dont keep comments up to date
// Usage :
// - selection persistence in frontend/src/editor/Editor.tsx:40,47,57,107
// - caret movement in frontend/src/editor/Editor.tsx:135

// Usage :
// - selection snapshots in frontend/src/editor/Editor.tsx:20
// - selection restore args in frontend/src/editor/selection.ts:125
export type SelectionOffsets = {
	start: number
	end: number
}

// When :
// - translating logical offsets to DOM positions, skip zero-width markers
// Usage :
// - logical -> DOM offset conversion in frontend/src/editor/selection.ts:50
const domOffsetFromLogical = (value: string, logicalOffset: number) => {
	if (logicalOffset <= 0) return 0
	let count = 0
	for (let i = 0; i < value.length; i++) {
		if (value[i] === '\u200B') continue
		count += 1
		if (count === logicalOffset) return i + 1
	}
	return value.length
}

// When :
// - computing a node's logical length (text + BRs), use editor-aware counting
// Usage :
// - accumulation when converting DOM -> logical in frontend/src/editor/selection.ts:70
// - caret jump across BR boundaries in frontend/src/editor/Editor.tsx:135
export const nodeTextLength = (node: Node): number => {
	if (node.nodeType === Node.TEXT_NODE) {
		return textLength(node.textContent)
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

// When :
// - resolving a logical offset inside a node, return the DOM node/offset for selection
// Usage :
// - selection restore for BR split in frontend/src/editor/selection.ts:106
// - selection restore within node in frontend/src/editor/selection.ts:115
// - caret jump across BR boundaries in frontend/src/editor/Editor.tsx:135
export const findPositionInNode = (node: Node, offset: number) => {
	const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT)
	let current: Node | null = walker.nextNode()
	let remaining = offset
	while (current) {
		const text = current.textContent ?? ''
		const len = textLength(text)
		if (remaining <= len) {
			return { node: current, offset: domOffsetFromLogical(text, remaining) }
		}
		remaining -= len
		current = walker.nextNode()
	}
	return { node, offset: 0 }
}

// When :
// - storing selection, convert a DOM node/offset into a logical offset from root
// Usage :
// - selection start calc in frontend/src/editor/selection.ts:144
// - selection end calc in frontend/src/editor/selection.ts:145
const offsetFromPosition = (root: HTMLElement, node: Node, offset: number) => {
	let total = 0
	const walk = (current: Node): boolean => {
		if (current === node) {
			if (current.nodeType === Node.TEXT_NODE) {
				const text = current.textContent ?? ''
				total += textLength(text.slice(0, offset))
			} else {
				const children = Array.from(current.childNodes)
				for (let i = 0; i < Math.min(offset, children.length); i++) {
					total += nodeTextLength(children[i])
				}
			}
			return true
		}
		if (current.nodeType === Node.TEXT_NODE) {
			total += textLength(current.textContent)
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

// When :
// - restoring selection, map a logical offset to the closest DOM position under root
// Usage :
// - selection start resolve in frontend/src/editor/selection.ts:128
// - selection end resolve in frontend/src/editor/selection.ts:129
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
		const len = textLength(node.textContent)
		if (remaining <= len) {
			return findPositionInNode(node, remaining)
		}
		remaining -= len
	}
	const last = nodes[nodes.length - 1]
	return { node: last, offset: last.childNodes.length }
}

// When :
// - rehydrating selection after DOM changes, apply stored logical offsets
// Usage :
// - post-HTML rebuild selection restore in frontend/src/editor/Editor.tsx:47
export const restoreSelectionOffsets = (root: HTMLElement, offsets: SelectionOffsets) => {
	const selection = window.getSelection()
	if (!selection) return
	const anchor = resolveSelectionPoint(root, offsets.start)
	const head = resolveSelectionPoint(root, offsets.end)
	const range = document.createRange()
	range.setStart(anchor.node, anchor.offset)
	range.setEnd(head.node, head.offset)
	selection.removeAllRanges()
	selection.addRange(range)
}

// When :
// - capturing selection state, return logical offsets relative to the editor root
// Usage :
// - before HTML rebuild in frontend/src/editor/Editor.tsx:40
// - before manual insert in frontend/src/editor/Editor.tsx:57
// - before backspace handling in frontend/src/editor/Editor.tsx:107
export const getSelectionOffsets = (root: HTMLElement) => {
	const selection = window.getSelection()
	if (!selection || selection.rangeCount === 0) return null
	const range = selection.getRangeAt(0)
	if (!root.contains(range.commonAncestorContainer)) return null
	const start = offsetFromPosition(root, range.startContainer, range.startOffset)
	const end = offsetFromPosition(root, range.endContainer, range.endOffset)
	return { start, end }
}
