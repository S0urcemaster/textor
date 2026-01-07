import { Document } from "../../../app/model";
import { gs } from "../../instructions";

export const effect_caesar_cypher: Document = {
   name: 'Caesar Cypher',
   folderName: 'Effects',
   editor: {
      text: '',
   },
   effects: [
      `1${gs}0\ncaesarcipher${gs}1`,
      `2${gs}0\ncaesarcipher${gs}2`,
      `3${gs}0\ncaesarcipher${gs}3`,
      `4${gs}0\ncaesarcipher${gs}4`,
      `5${gs}0\ncaesarcipher${gs}5`,
   ],
   editable: true,
   deletable: false
}