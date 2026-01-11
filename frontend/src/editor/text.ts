export const stripZeroWidth = (value: string) => value.replace(/\u200B/g, '')

export const textLength = (value?: string | null) => stripZeroWidth(value ?? '').length

export const getPlainText = (root: HTMLElement) => {
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
