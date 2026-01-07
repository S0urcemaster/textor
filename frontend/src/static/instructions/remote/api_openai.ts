import { Instruction } from "../../../app/model"
import { gs } from "../../instructions"

const url = "https://api.openai.com/v1/responses"

export const instruction_api_openai: Instruction = {
   name: "apiopenai",
   update: async (text: string, apiKey: string) => {
      if (!apiKey || apiKey === 'yourapikey') return `usage: apiopenai${gs}your free API key from platform.openai.com`
      if(!text) return 'waiting for prompt'
      const res = await fetch(url, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
         },
         body: JSON.stringify({
            model: "gpt-4o-mini",
            input: text,
            store: true,
         }),
      })

      if (!res.ok) {
         const errText = await res.text()
         return `error: ${res.status} ${errText}`
      }

      const data = await res.json()
      const output = data.output?.[0]?.content?.[0]?.text || JSON.stringify(data)

      return output
   },
   manual: true
}
