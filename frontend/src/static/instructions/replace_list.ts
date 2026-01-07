import { Instruction } from "../../app/model"

export const instruction_replace_list: Instruction = {
   name: 'replacelist',
   update: async (text: string, searchList: string, replaceList: string) => {
      return 'Replace List not implemented yet' // Implementierung fehlt
      // const searches = searchList.split('\n')
      // const replaces = replaceList.split('\n')
      // let updatedText = text
      // for (let i = 0 i < searches.length i++) {
      // 	const search = searches[i]
      // 	const replace = replaces[i] ?? ''
      // 	if (search) {
      // 		updatedText = updatedText.replace(new RegExp(search, 'g'), replace)
      // 	}
      // }
      // return updatedText
   },
   manual: false
}