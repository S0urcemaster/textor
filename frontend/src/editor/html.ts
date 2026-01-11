export type EditorHtmlStyles = {
	paragraph: string
	paragraphSoft: string
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

const softBreakToken = '\v'
const softBreakTag = '<br data-soft="1">'

export const buildEditorHtml = (source: string, styles: EditorHtmlStyles) => {
	const lines = source.split(/\r?\n/)
	const result = lines
		.map(line => {
			const segments = line.split(softBreakToken)
			return segments.map((segment, index) => {
				const escaped = escapeHtml(segment)
				const withTags = escaped.replace(tagRegex, (_, lead, tag) => {
					const style = tag.startsWith('@') ? styles.attag : styles.hashtag
					return `${lead}<span style="${style}">${tag}</span>`
				})
				const content = withTags === '' ? emptyLinePlaceholder : withTags
				const style = index < segments.length - 1 ? styles.paragraphSoft : styles.paragraph
				return `<span style="${style}">${content}</span>`
			}).join(softBreakTag)
		})
		.join('<br>')
	return result
}
