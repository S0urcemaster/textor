import { Document } from "../../../app/model";
import { defaultState } from "../../constants";
import { gs } from "../../instructions";

export const document_userchars: Document = {
   name: 'user-chars',
   folderName: 'System',
   editor: {
      text: '',
   },
   effects: [
      `Settings
updatesettings${gs}userchars`,
   ],
   editable: true,
   deletable: false
}