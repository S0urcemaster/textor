import { Document } from "../../../app/model";
import { gs } from "../../instructions";

export const document_settings: Document = {
   name: 'Settings',
   folderName: 'System',
   editor: {
      text: `startup {
   showWelcome: true
}
System {
   safetyButtonDelay: 400ms
   animation: 0ms
}
cloneEditColor: #654984
editorBackground: #654654
`,
   },
   effects: [
      `Settings\nupdateSettings${gs}`,
   ],
   editable: true,
   deletable: false
}