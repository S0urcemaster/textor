import { Document } from "../../../app/model";

export const document_docs_intro: Document = {
   name: 'doc_intro',
   folderName: 'System',
   editor: {
      text: `Texᴛᴑʀ manual
Texᴛᴑʀ is a source text editor combined with a programmable effect section
TOP : source text
   ▶ source text with functions : font family / font size / line height / letter spacing
MIDDLE : program tabs
   ▶ left side : clear text contents (⌫) / copy to clipboard (⎘) / download as file (⭳)
   ▶ center : current document with statistics
   ▶ right side : main tabs : characters / files / account / info
      ☺ Characters :
         ▶ Top row menu with symbols to insert into the source text s selection
      🗂 Files :
         ▶ Select left a folder and right a file / You can create new files by entering a new name for an existing file
      🗝 Account :
         ▶ Reset local storage to default
      🛈 Info :
         ▶ Some info
BOTTOM : Effects section
   ▶ Selected effect s name and instructions
   ▶ List of effects
`,
      fontSize: 15,
   },
   effects: [
      'TLDR\ntldr'
   ],
   editable: false,
   deletable: false
}