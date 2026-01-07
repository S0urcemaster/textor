import { Instruction } from "../../app/model"

export const instruction_no_whitespace: Instruction = {
   name: 'nowhitespace',
   update: async (text: string) => {
      return text.replace(/\s+/g, '')
   },
   manual: false
}