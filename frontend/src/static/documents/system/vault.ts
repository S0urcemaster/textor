import { Document } from "../../../app/model";
import { gs } from "../../instructions"

export const document_vault_export_instruction = `Export Vault\napivaultexport${gs}`
export const document_vault_import_instruction = `Import Vault\napivaultimport${gs}`

export const document_vault: Document = {
   name: 'vault',
   folderName: 'System',
   editor: {
      text: `This is textors vault where you can store values encrypted on the browsers disk (on your hard drive)
and use them like variables inside textor .
You can export the vault to another browser by importing the generated key code from the current export effect on the new browser with the import effect
`,
      fontSize: 15
   },
   effects: [
      `Suggest Password\nrandomwords${gs}5${gs}6${gs}12`,
      `Passwort vorschlagen\napiwikipediawords${gs}5${gs}6${gs}12`,
      document_vault_export_instruction,
      document_vault_import_instruction,
   ],
   editable: false,
   deletable: false,
}