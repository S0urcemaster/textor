import { Instruction } from "../../../app/model"

export const application: Instruction = {
   name: 'application',
   update: async (text: string) => {
      return 'First Name : '
   },
   manual: false
}