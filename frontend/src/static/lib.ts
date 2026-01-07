import { gs, instructions } from './instructions'
import { App as AppModel, Document, Effect, Instruction } from '../app/model'
import { dlog, log } from './log'

export const lib = {
	averageHexColor: (hex1: string, hex2: string): string => {
		const parse = (hex: string) => {
			const clean = hex.replace('#', '')
			const hasAlpha = clean.length === 8
			const bigint = parseInt(clean, 16)

			const r = (bigint >> (hasAlpha ? 24 : 16)) & 255
			const g = (bigint >> (hasAlpha ? 16 : 8)) & 255
			const b = (bigint >> (hasAlpha ? 8 : 0)) & 255
			const a = hasAlpha ? bigint & 255 : 255

			return { r, g, b, a }
		}

		const srgbToLinear = (v: number) => {
			const x = v / 255
			return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
		}

		const linearToSrgb = (v: number) => {
			const x = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055
			return Math.round(x * 255)
		}

		const c1 = parse(hex1)
		const c2 = parse(hex2)

		const avgLinear = {
			r: (srgbToLinear(c1.r) + srgbToLinear(c2.r)) / 2,
			g: (srgbToLinear(c1.g) + srgbToLinear(c2.g)) / 2,
			b: (srgbToLinear(c1.b) + srgbToLinear(c2.b)) / 2,
			a: (c1.a + c2.a) / 2
		}

		const toHex = (n: number) => n.toString(16).padStart(2, '0')

		const r = linearToSrgb(avgLinear.r)
		const g = linearToSrgb(avgLinear.g)
		const b = linearToSrgb(avgLinear.b)
		const a = Math.round(avgLinear.a)

		return '#' + toHex(r) + toHex(g) + toHex(b) + toHex(a)
	},
	shortenLongStrings: (value: unknown, maxLength = 20): unknown => {
		if (typeof value === 'string') {
			return value.length > maxLength
				? value.slice(0, maxLength) + ' ...'
				: value
		}

		if (Array.isArray(value)) {
			return value.map(item => lib.shortenLongStrings(item, maxLength))
		}

		if (value && typeof value === 'object') {
			const out: Record<string, unknown> = {}
			for (const key in value) {
				out[key] = lib.shortenLongStrings((value as Record<string, unknown>)[key], maxLength)
			}
			return out
		}

		return value
	},

	deriveKey: async (password: string, salt: ArrayBuffer) => {
		const keyMaterial = await crypto.subtle.importKey(
			'raw',
			new TextEncoder().encode(password),
			'PBKDF2',
			false,
			['deriveKey']
		)
		return crypto.subtle.deriveKey(
			{
				name: 'PBKDF2',
				salt,
				iterations: 100000,
				hash: 'SHA-256'
			},
			keyMaterial,
			{ name: 'AES-GCM', length: 256 },
			false,
			['encrypt', 'decrypt']
		)
	},

	encrypt: async (text: string, password: string) => {
		const salt = crypto.getRandomValues(new Uint8Array(16))
		const iv = crypto.getRandomValues(new Uint8Array(12))
		const key = await lib.deriveKey(password, salt.buffer)

		const encrypted = await crypto.subtle.encrypt(
			{ name: 'AES-GCM', iv },
			key,
			new TextEncoder().encode(text)
		)

		// Salt + IV + Ciphertext zusammenführen (Base64 kodiert)
		const combined = new Uint8Array([...salt, ...iv, ...new Uint8Array(encrypted)])
		return btoa(String.fromCharCode(...combined))
	},

	decrypt: async (encoded: string, password: string) => {
		const data = Uint8Array.from(atob(encoded), c => c.charCodeAt(0))
		const salt = data.slice(0, 16)
		const iv = data.slice(16, 28)
		const ciphertext = data.slice(28)

		const key = await lib.deriveKey(password, salt.buffer)
		const decrypted = await crypto.subtle.decrypt(
			{ name: 'AES-GCM', iv },
			key,
			ciphertext
		)
		return new TextDecoder().decode(decrypted)
	},

	estimateTokens: (text: string): number => {
		const wordCount = text.trim().split(/\s+/).length
		const ratio = 1 / 0.75
		return Math.round(wordCount * ratio)
	},

	countWords: (text: string): number => {
		// 1️⃣ Alles außer Buchstaben, Zahlen und Leerzeichen entfernen
		const cleaned = text
			.toLowerCase()
			.replace(/[^a-zA-ZäöüÄÖÜß0-9\s]/g, "") // Deutsch-kompatibel

		// 2️⃣ Überflüssige Leerzeichen entfernen und aufsplitten
		const words = cleaned.trim().split(/\s+/)

		// 3️⃣ Falls der Text leer ist → 0 Wörter
		return cleaned.trim() === "" ? 0 : words.length
	},

	flagEmoji: (countryCode: string): string => {
		// Unicode-Offset für "REGIONAL INDICATOR SYMBOL LETTER A"
		const OFFSET = 0x1F1E6;
		const A_CHAR_CODE = "A".charCodeAt(0);

		const chars = countryCode.toUpperCase().split("").map(ch => {
			const code = ch.charCodeAt(0);
			// Buchstabe A → 0 → OFFSET + 0, B → 1 → OFFSET + 1 usw.
			return String.fromCodePoint(OFFSET + (code - A_CHAR_CODE));
		});
		// Zwei Zeichen ergeben zusammen das Flaggen-Emoji
		return chars.join("");
	},

	getRotatedOffset: (range: number, value: number, offset: number): number => {
		return (offset + range + value) % range;
	},

	updateEach: async (source: string, insts: Instruction[]): Promise<string> => {
		log([dlog.tlib], 'updateEach', { source, insts: [...insts] })
		if (!insts || insts.length === 0) {
			return 'empty instruction'
		}

		let result = source
		let errors = ''

		for (const inst of insts) {
			const storedInstruction = instructions[inst.name]
			if (!storedInstruction) {
				errors += 'no such instruction : ' + inst.name
			} else {
				// 		if(inst.name === instruction_update_settings.name) {
				// 			if (!inst.args) errors += 'usage: updatesettings⧘type with type being userchars or colors'
				// switch (inst.args[1]) {
				//    case 'userchars':
				//       updateSettings({userChars: text.split(cs)})
				//       break
				//    case 'colors':
				//       break
				// }
				// 		}
				try {
					if (inst.args) {
						result = await storedInstruction.update(result, ...inst.args)
					} else {
						result = await storedInstruction.update(result)
					}
				} catch (err) {
					errors += `error in instruction ${inst.name}: ${err}\n`
				}
			}
		}
		return errors ? errors + '\n' + result : result
	},

	toTextInstructions: (insts: Instruction[]): string => {
		log([dlog.tlib], 'toTextInstructions()', { insts })
		const result = insts.map(inst => {
			const res = inst.args && inst.args.length > 0 ? [`${inst.name}`, inst.args.join(gs)].join(gs) : `${inst.name}`
			log([dlog.tlib], 'toTextInstructions()', { res })
			return res
		})
		log([dlog.tlib], 'toTextInstructions()', { result: result.join('\n') })
		return result.join('\n')
	},

	instructionByName: (name: string) => {
		return Object.values(instructions).find(e => e.name === name)
	},

	fromTextInstructions: (text: string): Instruction[] => {
		log([dlog.tlib], 'fromTextInstructions()', { text: JSON.stringify(text) })
		if (!text) return []
		const instructions = text.split('\n')
		const headItems = instructions[0].split(gs)
		const name = headItems[0]
		let sourceId, fontSize
		if (headItems.length < 1) return []
		else if (headItems.length === 2) {
			sourceId = headItems[1]
		}
		else if (headItems.length === 3) {
			fontSize = headItems[2]
		}
		const nameInstruction = lib.instructionByName(name)
		if (!nameInstruction) return []
		const args = []
		if (sourceId) {
			args.push(sourceId)
			if (fontSize) args.push(fontSize)
		}
		const nameEffect = { ...nameInstruction, name: name, args: args }
		const tail = instructions.splice(1).reduce<Instruction[]>((acc, inst) => {
			const line = inst.split(gs)
			const instruction = lib.instructionByName(line[0])
			if (!instruction) return acc
			acc.push({ ...instruction, name: line[0], args: line.splice(1) })
			return acc
		}, [])
		const result = [nameEffect, ...tail]
		return result
	},

	findDoc: (documents: Document[], folder: string, file: string): Document | undefined => {
		return documents.find(doc => {
			const equalsFolder = doc.folderName === folder
			const equalsFile = doc.name === file
			return equalsFolder && equalsFile
		})
	},

	indexDocuments: (state: AppModel) => {
		state.documents.forEach((doc, ix) => {
			doc.id = ix
		})
	},

	nextDocumentIndex: (state: AppModel) => {
		let max = 0
		state.documents.forEach(doc => {
			if (doc.id !== undefined && doc.id > max) {
				max = doc.id
			}
		})
		return max + 1
	},

	extractFolders: (documents: Document[]): string[] => {
		const folders = new Set<string>()
		documents.forEach(doc => {
			folders.add(doc.folderName)
		})
		return Array.from(folders)
	},

	getFilesByFolder: (documents: Document[], folder: string): string[] => {
		const files = new Set<string>()
		documents.forEach(doc => {
			if (doc.folderName === folder) {
				files.add(doc.name)
			}
		})
		return Array.from(files)
	},

	validateCommand: (command: string): boolean => {
		return true
	},

	parseInstruction: (command: string): Instruction | null => {
		if (!lib.validateCommand(command)) return null
		const split = command.trim().split(/\s+/)
		const effect = Object.values(instructions).find(effect => {
			return effect.name.toLowerCase() === split[0].toLowerCase()
		})
		if (!effect) return null
		effect.args = split.slice(1)
		return effect
	},

	isApiEffect: (effect: Instruction[]): boolean => {
		return effect.find(i => i.name.startsWith('api')) ? true : false
	}
}
