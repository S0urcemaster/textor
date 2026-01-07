import { Document } from "../../../app/model";
import { gs } from "../../instructions";

export const document_openai: Document = {
   name: 'OpenAI',
   folderName: 'Effects',
   editor: {
      text: '',
   },
   effects: [
      `OpenAI\napiopenai${gs}yourapikey`,
   ],
   editable: true,
   deletable: false
}