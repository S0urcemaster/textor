
import { document_default } from './documents/default'
import { document_bluesky_x } from './documents/bluesky_x'
import { effect_caesar_cypher } from './documents/effects/caesar_cypher'
import { document_docs_intro } from './documents/system/docs_intro'
import { document_settings } from './documents/system/settings'
import { settings_default_light } from './themes/default_light'
import { App, Vault } from '../app/model'
import { document_passmaker } from './documents/passmaker'
import { document_openai } from './documents/effects/openai'
import { document_updates } from './documents/system/updates'
import { document_userchars } from './documents/system/user-chars'
import { document_vault } from './documents/system/vault'
import { document_paginator } from './documents/effects/paginator'

export const account_section_height = 200

const default_documents = [
	document_default,
	document_bluesky_x,
	document_passmaker,
	document_openai,
	effect_caesar_cypher,
	document_docs_intro,
	document_paginator,
	document_settings,
	document_updates,
	document_userchars,
	document_vault,
].map(doc => ({
	...doc, editor: {
		text: doc.editor?.text ?? '',
		fontName: 'Noto Sans',
		fontSize: 20,
		lineHeight: 1.2,
		letterSpacing: 0,
		...doc.editor
	}
}))

export const defaultState: App = {
	version: '0.32',
	documents: default_documents,
	// light
	settings: { ...settings_default_light, userChars: '↻⧘»⧘«⧘😅⧘🤔⧘😁⧘😆⧘😂⧘🥳⧘😉⧘😊⧘›⧘‹⧘➞⧘■⧘★⧘✱⧘…' }
	// dark
	,
	vault: undefined
}

export const defaultVault: Vault = {
	vault_password: 'pizza',
	openai_api_key: '',
	bluesky_key: '',
	secret_todo_list: '',
	password_transfer: '',
}

type Font = {
	name: string
	className: string
}

export const NotoSansFont = {
	className: 'font-noto-sans',
}

export const robotoMonoFont = {
	className: 'font-roboto-mono',
}

export const NotoSerifFont = {
	className: 'font-noto-serif',
}

export const GlutenFont = {
	className: 'font-gluten',
}

export const FONT_NOTO_SANS = 'Noto Sans'
export const FONT_NOTO_SERIF = 'Noto Serif'
export const FONT_ROBOTO_MONO = 'Roboto Mono'
export const FONT_GLUTEN = 'Gluten'

export const fonts: Record<string, Font> = {
	[FONT_NOTO_SANS]: {
		name: 'Noto Sans',
		className: NotoSansFont.className,
	},
	[FONT_NOTO_SERIF]: {
		name: 'Noto Serif',
		className: NotoSerifFont.className,
	},
	[FONT_ROBOTO_MONO]: {
		name: 'Roboto Mono',
		className: robotoMonoFont.className,
	},
	[FONT_GLUTEN]: {
		name: 'Gluten',
		className: GlutenFont.className,
	},
}
