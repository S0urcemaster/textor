import { TextorContext } from "../../../app/context"
import { Instruction } from "../../../app/model"

export const instruction_help: Instruction = {
      name: 'help',
      update: async (text: string) => {
         return `Effects Help
❗ api... -instructions will query - or send the source text to - remote servers !
Format : instructionname⧘param1⧘param2⧘...
Quick Example : replacechars⧘ab⧘xy⧘01⧘+-⧘-1⧘...
■ apiwikipediawords⧘count⧘minLength⧘maxLength
Get some random words from wikipedia
■ apiopenai⧘apiKey
Send a query to the free but limited GPT endpoint
■ caesarcipher⧘offset
Shift a text to the left or right
■ help
This help
■ nowhitespace
Removes all whitespace
■ replacechars⧘pair1⧘pair2⧘pair3⧘...
Replaces a list of characters with a replacement
□ replacetext⧘from⧘to
Will replace one single text with another
`
      },
      manual: false
   }