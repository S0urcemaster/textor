import { useEffect, useRef, useState } from "react"
import { lib } from "../../static/lib"
import { dlog, log } from "../../static/log"
import { fonts, FONT_NOTO_SANS } from "../../static/constants"

const sizeLadder = [
   6, 7, 8, 9, 10,
   11, 12, 13, 14, 15,
   16, 18, 20, 22, 24,
   26, 28, 32, 36, 40,
   48, 56, 64, 72
]

const lineHeightLadder = [
   0.8, 0.85, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2, 1.25,
   1.3, 1.35, 1.4, 1.45,
   1.5, 1.6, 1.7, 1.9, 2.5
]

const letterSpacingLadder = [
   -3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4
]

const debounceTime = 500

type EditorInit = {
   text?: string
   family?: string
   size?: number
   lineHeight?: number
   letterSpacing?: number
}

export default function ({ init }: { init: EditorInit }) {

   const [text, setText] = useState<string>(init?.text ?? '')
   const [fontFamily, setFontFamily] = useState<string>(init?.family ?? FONT_NOTO_SANS)
   const [fontSize, setFontSize] = useState<number>(init?.size ?? 20)
   const [lineHeight, setLineHeight] = useState<number>(init?.lineHeight ?? 1.2)
   const [letterSpacing, setLetterSpacing] = useState<number>(init?.letterSpacing ?? 0)

   const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

   useEffect(() => {
      log([dlog.teditor], 'init', { init })
      if (init) {
         setText(init.text ?? '')
         setFontFamily(init.family ?? FONT_NOTO_SANS)
         setFontSize(init.size ?? 20)
         setLineHeight(init.lineHeight ?? 1.2)
         setLetterSpacing(init.letterSpacing ?? 0)
      }
   }, [init])

   function updateText(text: string) {
      if (debounceTimerRef.current) {
         clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = setTimeout(() => {
         setText(text)
      }, debounceTime)
   }

   function fontSizeUp() {
      setFontSize(sizeLadder[lib.getRotatedOffset(sizeLadder.length, sizeLadder.indexOf(fontSize), 1)])
   }

   function fontSizeDown() {
      setFontSize(sizeLadder[lib.getRotatedOffset(sizeLadder.length, sizeLadder.indexOf(fontSize), -1)])
   }

   function nextFamily() {
      const keys = Object.keys(fonts)
      const ix = keys.indexOf(fontFamily)
      const nextFont = Object.values(fonts)[lib.getRotatedOffset(keys.length, ix, 1)]
      setFontFamily(nextFont.name)
   }

   function lineHeightUp() {
      setLineHeight(lineHeightLadder[lib.getRotatedOffset(lineHeightLadder.length, lineHeightLadder.indexOf(lineHeight), 1)])
   }

   function lineHeightDown() {
      setLineHeight(lineHeightLadder[lib.getRotatedOffset(lineHeightLadder.length, lineHeightLadder.indexOf(lineHeight), -1)])
   }

   function letterSpacingUp() {
      setLetterSpacing(letterSpacingLadder[lib.getRotatedOffset(letterSpacingLadder.length, letterSpacingLadder.indexOf(letterSpacing), 1)])
   }

   function letterSpacingDown() {
      setLetterSpacing(letterSpacingLadder[lib.getRotatedOffset(letterSpacingLadder.length, letterSpacingLadder.indexOf(letterSpacing), -1)])
   }

   return {
      text, family: fontFamily, size: fontSize, lineHeight, letterSpacing,
      setText: updateText, fontSizeUp, fontSizeDown, nextFamily, lineHeightUp, lineHeightDown, letterSpacingUp, letterSpacingDown
   }
}
