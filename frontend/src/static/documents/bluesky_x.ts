import { Document } from "../../app/model";
import { gs } from "../instructions";

export const document_bluesky_x: Document = {
   name: 'X and Bluesky Split',
   folderName: 'User',
   editor: {
      text: '',
   },
   effects: [
      // `Influenza${cs}0${cs}\nreplacechars${cs}.·`,
      `X Part 1${gs}1\nsubstring${gs}0${gs}280`,
      `X Part 2${gs}1\nsubstring${gs}280${gs}560 `,
      `X Part 3${gs}1\nsubstring${gs}560${gs}840 `,
      `Bluesky Part 1${gs}1\nsubstring${gs}0${gs}300 `,
      `Bluesky Part 2${gs}1\nsubstring${gs}300${gs}600 `,
      `Bluesky Part 3${gs}1\nsubstring${gs}600${gs}900 `,
   ],
   editable: true,
   deletable: true
}