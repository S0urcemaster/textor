import { Instruction } from "../../../app/model"
import { global_separator } from "../../instructions"

const url = 'https://de.wikipedia.org/w/api.php' +
   '?action=query' +
   '&format=json' +
   '&origin=*' +
   '&generator=random' +
   '&grnnamespace=0' +
   '&prop=extracts' +
   '&explaintext=1'

export const instruction_api_wikipedia_words: Instruction = {
   name: 'apiwikipediawords',
   update: async (text: string, count?: string, minLength?: string, maxLength?: string) => {
      if(!count || !minLength || !maxLength) return 'usage: apiwikipediawords⧘count⧘minLength⧘maxLength'
      if(isNaN(Number(count))) return 'count not a number'
      if(isNaN(Number(minLength))) return 'minLength not a number'
      if(isNaN(Number(maxLength))) return 'maxLength not a number'
      if(Number(minLength) > Number(maxLength)) return 'maxLength > minLength'
      return getRandomWords(Number(minLength), Number(maxLength), Number(count)).then(words => words.join(global_separator)).catch(() => '')
   },
   manual: true
}

async function getRandomWords(minLength: number, maxLength: number, count: number): Promise<string[]> {
   const res = await fetch(url)
   const data = await res.json()

   const pages = data.query.pages
   const page = pages[Object.keys(pages)[0]]
   const text = String(page.extract ?? '')

   const words = text
      .toLowerCase()
      .replace(/[^a-zäöüß]+/g, " ") // nur Buchstaben behalten
      .split(/\s+/)
      .filter(word => word.length >= minLength && word.length <= maxLength)
   // Duplikate raus
   const unique = Array.from(new Set(words))

   // Zufallsauswahl
   const shuffled = unique.sort(() => Math.random() - 0.5)
   const result = shuffled.slice(0, count)
   return result
}
