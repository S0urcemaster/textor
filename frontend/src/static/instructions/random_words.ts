import { Instruction } from '../../app/model'
import { generate } from 'random-words'

export const instruction_random_words: Instruction = {
   name: 'randomwords',
   update: async (text: string, countStr: string, minLengthStr: string, maxLengthStr: string) => {
      const usage = 'Usage: randomwords⧘count⧘minLength⧘maxLength'
      const count = Number(countStr)
      const minLength = Number(minLengthStr)
      const maxLength = Number(maxLengthStr)

      if (
         isNaN(count) || count <= 0 ||
         isNaN(minLength) || minLength <= 0 ||
         isNaN(maxLength) || maxLength < minLength
      ) {
         return usage
      }

      const words = generate({ exactly: count, minLength, maxLength }) as []
      return words.join(' ')
   },
   manual: true
}
