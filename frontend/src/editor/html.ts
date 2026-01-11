type EditorHtmlStyles = {
	p: string
	hashtag: string
}

const escapeHtml = (value: string) =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;')

const tagRegex = /(^|\s)(#[A-Za-z0-9_]+)/g
// Keeps empty lines selectable in contentEditable; stripped on read.
const emptyLinePlaceholder = '&#8203;'

export const buildEditorHtml = (source: string, styles: EditorHtmlStyles) => {
	const lines = source.split(/\r?\n/)
	const result = lines
		.map(line => {
			const escaped = escapeHtml(line)
			const withTags = escaped.replace(tagRegex, `$1<span style="${styles.hashtag}">$2</span>`)
			const content = withTags === '' ? emptyLinePlaceholder : withTags
			return `<span style="${styles.p}">${content}</span>`
		})
		.join('<br>')
	return result
}
