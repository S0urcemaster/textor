import { Instruction } from "../../app/model"

export const instruction_replace_text: Instruction = {
      name: 'replacetext',
      update: async (text: string, search: string, replace: string) => {
         return 'Replace Text not implemented yet' // Implementierung fehlt
         // return text.replace(new RegExp(search, 'g'), replace)
      },
      manual: false
   }