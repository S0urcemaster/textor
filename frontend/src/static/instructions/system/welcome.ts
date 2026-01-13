import { Instruction } from "../../../app/model"

export const instruction_welcome: Instruction = {
	name: 'welcome',
	update: async (text: string) => {
		if (text) return `26⧘01⧘07 Happy New Year ! Terms = (Still) all free - no registration - no personal data storage
Take care before pressing "remote" -buttons !`

		return `Welcome to Texᴛᴑʀ 😀
Tip of day 1 : You can duplicate files by renaming them
Tip of day 2 : Textor auto saves each time you pause
Tip of day 3 : 

Texᴛᴑʀ is an early stage app that aims at productivity with writing texts

Everything you type stays local on your machine until you decide otherwise

Have fun 🥳`
	},
	manual: false
}