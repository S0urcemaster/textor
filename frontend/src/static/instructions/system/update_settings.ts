import { TextorContext } from "../../../app/context"
import { Instruction } from "../../../app/model"
import { gs } from "../../instructions"

export const instruction_update_settings: Instruction = {
   name: 'updatesettings',
   update: async (text: string) => {
      return text
   },
   manual: true
}