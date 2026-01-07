import { lib } from "./lib"

export const dlog = {
	tapp: 'app',
	tbuttons: 'button',
	tcomponents: 'components',
	tcontext: 'context',
	teffects: 'effects',
	thooks: 'hoosk',
	tinstructions: 'insructions',
	tlocalstorage: 'localstorage',
	tdingsda: 'dingsda',
	tlib: 'lib',
	tpanels: 'panels',
	tvault: 'vault',
	teditor: 'editor',

	cblue: '#6370ffff',
	cgreen: '#47ff19ff',
	cgrey: '#888',
	cgreylight: '#cacacaff',
	corange: '#e69a30ff',
	cpurple: '#d264c5ff',
	cred: '#ce5858ff',
	cyellow: '#ebd85bff',
	ccyan: '#5bccebff',
}

const defaultTagColors: Record<string, string> = {
	[dlog.tapp]: dlog.cpurple,
	[dlog.tbuttons]: dlog.ccyan,
	[dlog.tcomponents]: dlog.cgreen,
	[dlog.tcontext]: dlog.cred,
	[dlog.tdingsda]: dlog.cblue,
	[dlog.teditor]: dlog.cpurple,
	[dlog.teffects]: dlog.cgreen,
	[dlog.thooks]: dlog.cpurple,
	[dlog.tinstructions]: dlog.corange,
	[dlog.tlib]: dlog.cyellow,
	[dlog.tlocalstorage]: dlog.cpurple,
	[dlog.tpanels]: dlog.cblue,
	[dlog.tvault]: dlog.corange,
}

const isDev = import.meta.env.VITE_DEV === 'true'

export const logConfig: Record<string, boolean> = {
	[dlog.tapp]: true,
	[dlog.tbuttons]: true,
	[dlog.tcomponents]: true,
	[dlog.tcontext]: true,
	[dlog.teditor]: true,
	[dlog.tdingsda]: true,
	[dlog.teffects]: true,
	[dlog.thooks]: true,
	[dlog.tinstructions]: true,
	[dlog.tlib]: true,
	[dlog.tlocalstorage]: true,
	[dlog.tpanels]: true,
	[dlog.tvault]: true,
}

const extractFilename = (line: string) => {
	if (!line) return 'unknown'

	// Erst mal alles nach "(...)" oder nach "@" rausziehen
	const match =
		line.match(/webpack-internal:\/\/\/\((?:.*?)\)\/\.(.*)/) ||
		line.match(/webpack-internal:\/\/\/(.*)/) ||
		line.match(/(\/.*\.(?:ts|tsx|js|jsx))/)

	if (!match) return 'unknown'

	const fullPath = match[1].trim()

	// Jetzt einfach den Dateinamen isolieren
	const parts = fullPath.split('/')
	return parts[parts.length - 1]
}

const getCallerFile = () => {
	const err = new Error()
	const stack = err.stack?.split('\n')

	// In Next.js taucht der eigentliche Caller meistens an Position 3 oder 4 auf
	const caller = stack?.find(line => (line.includes('.tsx') || line.includes('.ts') && !line.includes('log.ts')))

		return extractFilename(caller?.match(/(\/.*\.(?:ts|tsx))/)?.[1] ?? '') || 'unknown'
}

const makeHeader = (tags: string[], title: string, file?: string, customColor?: string) => {
	const tagString = tags.map(tag => `%c[${tag}]`).join('')
	const styles = tags.map(tag => `color: ${customColor || defaultTagColors[tag] || 'black'}; font-weight: normal;`)

	const date = new Date()
	const minutes = String(date.getMinutes()).padStart(2, '0')
	const seconds = String(date.getSeconds()).padStart(2, '0')
	const milliseconds = String(date.getMilliseconds()).padStart(3, '0')
	const timestamp = `%c[${minutes}:${seconds}:${milliseconds}]`

	styles.push(`color: ${customColor || '#c1deffff'}; font-weight: normal;`)
	styles.unshift(`color: #a3aeb9ff; font-style: italic;`)
	styles.unshift('color: grey; font-style: italic;')

	return { tagString: `${timestamp} %c${getCallerFile()} ${tagString} %c${title}`, styles }
}

const isTagActive = (tags: string[]) => tags.some(tag => logConfig[tag])

export const log = (tags: string[], title: string, value: any, customColor?: string) => {
	if (!isDev || !isTagActive(tags)) return
	const { tagString, styles } = makeHeader(tags, title, customColor)
	console.log(tagString, ...styles, lib.shortenLongStrings(value))
}

export const logBold = (tags: string[], title: string, value: any, customColor?: string) => {
	if (!isDev || !isTagActive(tags)) return
	const { tagString, styles } = makeHeader(tags, title, customColor)
	const boldStyles = styles.map(s =>
		s.replace('font-weight: normal', 'font-weight: bold')
			.replace('color: grey; font-style: italic;', 'color: white; font-style: italic;')
	)
	console.log(tagString, ...boldStyles, lib.shortenLongStrings(value))
}

export const logInfo = (tags: string[], info: string, customColor?: string) => {
	if (!isDev || !isTagActive(tags)) return
	const { tagString, styles } = makeHeader(tags, '', customColor)
	console.log(tagString, ...styles, info)
}
