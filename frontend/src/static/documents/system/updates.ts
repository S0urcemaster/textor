import { Document } from "../../../app/model";

export const document_updates: Document = {
   name: 'updates',
   folderName: 'System',
   editor: {
      text: `Texᴛᴑʀ updates
25⧘12⧘06 +paginator instruction and document; fixes
25⧘11⧘30 v0.27 more fixes and optimizations
25⧘11⧘28 v0.25 major rework and cleanup
25⧘11⧘12 Encrypted vault for keys and passwords
25⧘11⧘05 #Hashtags and fixes
25⧘10⧘25 fist effect scroll fix; ~layout; ~terms; ~docs
25⧘10⧘24 ~layout; +separatorButton
25⧘10⧘23 source text : copy and download; editable filenames
25⧘10⧘22 new logo that opens updates document; +updates; resetStorage; files head removed; ~manual
25⧘10⧘21 ~font; +lineHeight; current filename +stats
`,
      fontSize: 10,
   },
   effects: [
      'TLDR\ntldr'
   ],
   editable: false,
   deletable: false,
}