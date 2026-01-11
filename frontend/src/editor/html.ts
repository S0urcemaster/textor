export type EditorHtmlStyles = {
	paragraph: string
	hashtag: string
	attag: string
}

const escapeHtml = (value: string) =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;')

const tagRegex = /(^|\s)([#@][A-Za-z0-9_äöüÄÖÜß]+)/g
// Keeps empty lines selectable in contentEditable; stripped on read.
const emptyLinePlaceholder = '&#8203;'

export const buildEditorHtml = (source: string, styles: EditorHtmlStyles) => {
	const lines = source.split(/\r?\n/)
	const result = lines
		.map(line => {
			const escaped = escapeHtml(line)
			const withTags = escaped.replace(tagRegex, (_, lead, tag) => {
				const style = tag.startsWith('@') ? styles.attag : styles.hashtag
				return `${lead}<span style="${style}">${tag}</span>`
			})
			const content = withTags === '' ? emptyLinePlaceholder : withTags
			return `<span style="${styles.paragraph}">${content}</span>`
		})
		.join('<br>')
	return result
}
