import { Instruction } from "../../app/model"

export const instruction_caesar_cypher: Instruction = {
      name: 'caesarcipher',
      update: async (text: string, offset: string) => {
         if(!offset || offset === '?') {
            return 'Caesar Cypher usage : caesarcipher⧘offset - while n is the positive or negative offset'
         }
         const shiftValue = Number(offset)
         if (isNaN(shiftValue) || !Number.isInteger(shiftValue)) {
            return 'command not valid'
         }
         return text.split('').map(char => {
            if (char.match(/[a-z]/i)) {
               const code = char.charCodeAt(0)
               const base = code >= 65 && code <= 90 ? 65 : 97
               // Ensure positive result for negative shifts
               const shiftedCode = (code - base + shiftValue) % 26
               return String.fromCharCode((shiftedCode < 0 ? shiftedCode + 26 : shiftedCode) + base)
            }
            return char
         }).join('')
      },
      manual: false
   }