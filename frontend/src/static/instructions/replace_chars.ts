import { Instruction } from "../../app/model"

const usage = `Usage : replacechars ab xy 12`

export const instruction_replace_chars: Instruction = {
  name: 'replacechars',
  update: async (text: string, ...args: string[]) => {
    const map: Record<string, string> = {}

    for (const pair of args) {
      if (pair.length !== 2) {
        return usage
      }
      const [from, to] = pair
      map[from] = to
    }

    const pattern = new RegExp(`[${Object.keys(map).join('')}]`, 'g')

    return text.replace(pattern, (match) => map[match] ?? match)
  },
  manual: false
}
