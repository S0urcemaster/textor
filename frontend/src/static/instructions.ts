import { instruction_caesar_cypher } from './instructions/caesar_cypher'
import { instruction_welcome } from './instructions/system/welcome'
import { instruction_replace_text } from './instructions/replace_text'
import { instruction_replace_list } from './instructions/replace_list'
import { instruction_no_whitespace } from './instructions/no_whitespace'
import { instruction_substring } from './instructions/substring'
import { instruction_tldr } from './instructions/tldr'
import { instruction_replace_chars } from './instructions/replace_chars'
import { instruction_help } from './instructions/system/effects_help'
import { Instruction } from '../app/model'
import { instruction_api_wikipedia_words } from './instructions/remote/api_wikipedia_words'
import { instruction_api_openai } from './instructions/remote/api_openai'
import { instruction_update_settings } from './instructions/system/update_settings'
import { instruction_random_words } from './instructions/random_words'
import { instruction_api_vaultexport } from './instructions/system/api_vaultexport'
import { instruction_api_vaultimport } from './instructions/system/api_vaultimport'
import instruction_updater from './instructions/system/updater'
import { instruction_paginator } from './instructions/paginator'

export const global_separator = '⧘'
export const gs = global_separator

export const API_OPENAI_INSTRUCTION = 'apiopenai'
export const API_WIKIPEDIA_WORDS_INSTRUCTION = 'apiwikipediawords'
export const API_VAULT_EXPORT_INSTRUCTION = 'apivaultexport'
export const API_VAULT_IMPORT_INSTRUCTION = 'apivaultimport'
export const CAESAR_CIPHER_INSTRUCTION = 'caesarcipher'
export const HELP_INSTRUCTION = 'help'
export const NO_WHITESPACE_INSTRUCTION = 'nowhitespace'
export const RANDOM_WORDS_INSTRUCTION = 'randomwords'
export const REPLACE_CHARS_INSTRUCTION = 'replacechars'
export const REPLACE_LIST_INSTRUCTION = 'replacelist'
export const REPLACE_TEXT_INSTRUCTION = 'replacetext'
export const SUBSTRING_INSTRUCTION = 'substring'
export const TLDR_INSTRUCTION = 'tldr'
export const WELCOME_INSTRUCTION = 'welcome'
export const UPDATE_SETTINGS_INSTRUCTION = 'updatesettings'
export const UPDATER_INSTRUCTION = 'updater'
export const PAGINATOR_INSTRUCTION = 'paginator'

export const instructions: Record<string, Instruction> = {
   ['name']: {
      name: 'name',
      update: async (text: string, sourceId: string, fontSize?: string) => 'name instruction',
      manual: false,
   },
   [API_WIKIPEDIA_WORDS_INSTRUCTION]: instruction_api_wikipedia_words,
   [API_OPENAI_INSTRUCTION]: instruction_api_openai,
   [API_VAULT_EXPORT_INSTRUCTION]: instruction_api_vaultexport,
   [API_VAULT_IMPORT_INSTRUCTION]: instruction_api_vaultimport,
   [CAESAR_CIPHER_INSTRUCTION]: instruction_caesar_cypher,
   [HELP_INSTRUCTION]: instruction_help,
   [NO_WHITESPACE_INSTRUCTION]: instruction_no_whitespace,
   [RANDOM_WORDS_INSTRUCTION]: instruction_random_words,
   [REPLACE_TEXT_INSTRUCTION]: instruction_replace_text,
   [REPLACE_LIST_INSTRUCTION]: instruction_replace_list,
   [REPLACE_CHARS_INSTRUCTION]: instruction_replace_chars,
   [SUBSTRING_INSTRUCTION]: instruction_substring,
   [TLDR_INSTRUCTION]: instruction_tldr,
   [WELCOME_INSTRUCTION]: instruction_welcome,
   [UPDATE_SETTINGS_INSTRUCTION]: instruction_update_settings,
   [UPDATER_INSTRUCTION]: instruction_updater,
   [PAGINATOR_INSTRUCTION]: instruction_paginator,
}
