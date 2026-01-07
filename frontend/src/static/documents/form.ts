import { Document } from "../../app/model";
import { gs } from "../instructions";

export const document_application: Document = {
   name: 'Application',
   folderName: 'forms',
   editor: {
      text: `First Name :
Family Name :
`,
   },
   effects: [
      `Form\nform${gs}`,
   ],
   editable: false,
   deletable: false
}