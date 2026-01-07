import { Document } from "../../app/model";
import { gs } from "../instructions";

export const document_passmaker: Document = {
   name: 'Passmaker',
   folderName: 'User',
   editor: {
      text: '',
   },
   effects: [
      `Passwortgenerator\napiwikipediawords${gs}5${gs}8${gs}15`,
   ],
   editable: true,
   deletable: true
}