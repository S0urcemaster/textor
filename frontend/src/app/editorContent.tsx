import { useRef, useEffect, CSSProperties } from 'react'
import { useTextorContext } from './context'
import { EditorView, keymap, MatchDecorator, placeholder, ViewUpdate } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'

import { Decoration, DecorationSet, ViewPlugin } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { dlog, log } from '../static/log'

const hashtagMatcher = new MatchDecorator({
   regexp: /[#@][\w]+/g,
   decoration: Decoration.mark({ class: 'cm-hashtag' })
})

const hashtagHighlighter = ViewPlugin.fromClass(
   class {
      decorations: DecorationSet
      constructor(view: EditorView) {
         this.decorations = hashtagMatcher.createDeco(view)
      }
      update(update: ViewUpdate) {
         this.decorations = hashtagMatcher.updateDeco(update, this.decorations)
      }
   },
   { decorations: v => v.decorations }
)

const urlMatcher = new MatchDecorator({
   regexp: /(https?:\/\/[^\s]+)/g,
   decoration: Decoration.mark({ class: 'cm-url' })
})

const urlHighlighter = ViewPlugin.fromClass(
   class {
      decorations: DecorationSet
      constructor(view: EditorView) {
         this.decorations = urlMatcher.createDeco(view)
      }
      update(update: ViewUpdate) {
         this.decorations = urlMatcher.updateDeco(update, this.decorations)
      }
   },
   { decorations: v => v.decorations }
)

export function EditorContent({ style }: { style?: CSSProperties }) {
   const { system, editor, files } = useTextorContext()

   const parentRef = useRef<HTMLDivElement>(null)
   const viewRef = useRef<EditorView | null>(null)

   const readOnlyCompartment = useRef(new Compartment())
   const themeCompartment = useRef(new Compartment())

   function insertText(view: EditorView, text: string, focus = true) {
      const sel = view.state.selection.main

      view.dispatch({
         changes: { from: sel.from, to: sel.to, insert: text },
         selection: { anchor: sel.from + text.length },
         scrollIntoView: true
      })

      if (focus) {
         setTimeout(() => {
            view.focus()
         }, 10)
      }
   }

   useEffect(() => {
      log([dlog.teditor], '[currentDocument, editorFontSize]', editor.fontSize)
      if (files.currentDocument && parentRef.current) {
         const startDoc = files.currentDocument.editor?.text ?? ''

         const updateListener = EditorView.updateListener.of((update: ViewUpdate) => {
            if (update.docChanged) {
               log([dlog.teditor], 'updateListener', { doc: update.state.doc.toString() })
               editor.setText(update.state.doc.toString())
            }
         })

         const themeExtension = themeCompartment.current.of(
            EditorView.theme({
               '&': { width: '100%', height: '100%' },
               '.cm-content': {
                  fontSize: editor.fontSize + 'pt',
                  fontFamily: editor.fontFamily,
                  lineHeight: editor.lineHeight,
                  letterSpacing: editor.letterSpacing + 'px',
                  userSelect: 'text',
               },
               '.cm-hashtag': {
                  color: system.settings.colors.blueAccent,
                  fontWeight: 'bold'
               },
               '.cm-url': {
                  color: system.settings.colors.effectEditorColor, // oder eine andere Farbe
                  textDecoration: 'underline',
                  cursor: 'pointer' // Zeigt an, dass es klickbar wirken soll
               },
               '&.cm-editor.cm-focused': { outline: 'none' },
               '.cm-line': { padding: 0 }
            })
         )

         const state = EditorState.create({
            doc: startDoc,
            selection: { anchor: 0 },
            extensions: [
               updateListener,
               themeExtension,
               hashtagHighlighter, urlHighlighter,
               EditorView.lineWrapping,
               history(),
               keymap.of([
                  {
                     key: '.',
                     run: view => {
                        insertText(view, '·', false)
                        return true
                     }
                  },
                  ...defaultKeymap,
                  ...historyKeymap
               ]),
               readOnlyCompartment.current.of(EditorState.readOnly.of(false)),
               placeholder(' ') // makes cursor visible with no text
            ]
         })

         const view = new EditorView({ state, parent: parentRef.current })
         view.dispatch({
            effects: readOnlyCompartment.current.reconfigure(
               EditorState.readOnly.of(!files.currentDocument.editable)
            )
         })
         viewRef.current = view

         return () => view.destroy()
      }
   }, [files.currentDocument])

   useEffect(() => {
      const view = viewRef.current
      if (!view) return

      view.dispatch({
         effects: themeCompartment.current.reconfigure(
            EditorView.theme({
               '.cm-content': {
                  fontSize: editor.fontSize + 'pt',
                  fontFamily: editor.fontFamily,
                  lineHeight: editor.lineHeight,
                  letterSpacing: editor.letterSpacing + 'px',

                  userSelect: 'text',
                  padding: 0
               },
               '.cm-hashtag': {
                  color: system.settings.colors.blueAccent,
                  fontWeight: 'bold'
               },
               '.cm-url': {
                  color: system.settings.colors.blueAccent,
                  fontWeight: 'bold',
               },
               '&.cm-editor.cm-focused': { outline: 'none' },
               '.cm-line': { padding: 0 }
            })
         )
      })
   }, [
      editor.fontSize,
      editor.fontFamily,
      editor.lineHeight,
      editor.letterSpacing
   ])

   useEffect(() => {
      const view = viewRef.current
      if (view && editor.actions) {
         editor.actions.forEach(([name, payload]) => {
            switch (name) {
               case 'clear':
                  clear()
                  break
               case 'insert':
                  insert(payload ?? '')
                  break
            }
         })
      }
   }, [editor.actions])

   function insert(text: string) {
      const view = viewRef.current
      if (!view) return

      insertText(view, text)
   }

   function clear() {
      const view = viewRef.current
      if (!view) return

      view.dispatch({
         changes: { from: 0, to: view.state.doc.length, insert: '' },
         selection: { anchor: 0 }
      })

   }

   return (
      <div
         ref={parentRef}
         id='editorContent'
         onClick={() => viewRef.current?.focus()}
         style={{
            display: 'flex',
            width: '100%',
            height: 300,
            overflowY: 'scroll',
            background: `linear-gradient(to top, ${system.settings.colors.editorBackgroundLo}, ${system.settings.colors.editorBackgroundHi})`,
            padding: '5px 6px 0px 11px',
            borderTop: `1px solid ${system.settings.colors.effectEditorColor}`,
            borderBottom: `1px solid ${system.settings.colors.lightDark}`,
            cursor: 'text',
            fontSize: editor.fontSize + 'pt',
            ...style
         }}
      />
   )
}
