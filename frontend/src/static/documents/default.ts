import { Document } from "../../app/model";

export const document_default: Document = {
   name: 'Default',
   folderName: 'User',
   editor: {
      text: '',
      fontSize: 20
   },
   effects: [
      'Welcome\nwelcome',
      'Updater\nupdater',
      'Effects Help\nhelp',
   ],
   editable: true,
   deletable: false,
}