'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { useEffect, useState } from 'react'
import { common, createLowlight } from 'lowlight'
import TurndownService from 'turndown'
import { marked } from 'marked'

const lowlight = createLowlight(common)
const turndownService = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' })

export function TiptapEditor({ content, onChange, dir: initialDir = 'rtl' }: { content: string; onChange: (md: string) => void; dir?: 'ltr' | 'rtl' }) {
  const [dir, setDir] = useState<'ltr' | 'rtl'>(initialDir)
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ codeBlock: false, heading: { levels: [1, 2, 3, 4, 5, 6] }, link: { openOnClick: false } }),
      Image.configure({ inline: false }),
      Table.configure({ resizable: true }),
      TableRow, TableHeader, TableCell,
      TaskList, TaskItem.configure({ nested: true }),
      CodeBlockLowlight.configure({ lowlight }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
    ],
    content: marked.parse(content) as string,
    editorProps: { attributes: { class: 'tiptap focus:outline-none min-h-[400px]', dir } },
    onUpdate: ({ editor }) => onChange(turndownService.turndown(editor.getHTML())),
  })
  useEffect(() => { const dom = editor?.view.dom as HTMLElement | undefined; if (dom) { dom.setAttribute('dir', dir); dom.querySelectorAll('th, td').forEach((el) => el.setAttribute('dir', dir)) } }, [dir, editor])
  if (!editor) return null
  const btn = (active: boolean) => `px-2 py-1 text-sm border rounded ${active ? 'bg-foreground text-background' : 'bg-background'}`
  return (
    <div dir={dir} className="flex flex-col h-full border rounded-lg overflow-hidden bg-background">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/40 items-center">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))}><span className="font-bold">B</span></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))}><span className="italic">I</span></button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className={btn(editor.isActive('strike'))}><span className="line-through">S</span></button>
        <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={btn(editor.isActive('highlight'))}>H</button>
        <span className="w-px h-6 bg-border mx-1" />
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btn(editor.isActive('heading', { level: 1 }))}>H1</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive('heading', { level: 2 }))}>H2</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive('heading', { level: 3 }))}>H3</button>
        <span className="w-px h-6 bg-border mx-1" />
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))}>•</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))}>1.</button>
        <button onClick={() => editor.chain().focus().toggleTaskList().run()} className={btn(editor.isActive('taskList'))}>☑</button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive('blockquote'))}>❝</button>
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btn(editor.isActive('codeBlock'))}>{'</>'}</button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="px-2 py-1 text-sm border rounded">―</button>
        <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className="px-2 py-1 text-sm border rounded">▦</button>
        <span className="w-px h-6 bg-border mx-1" />
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btn(editor.isActive({ textAlign: 'left' }))} title="Align left">⬅</button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btn(editor.isActive({ textAlign: 'center' }))} title="Center">⬌</button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btn(editor.isActive({ textAlign: 'right' }))} title="Align right (Farsi)">➡</button>
        <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={btn(editor.isActive({ textAlign: 'justify' }))} title="Justify">☰</button>
        <span className="w-px h-6 bg-border mx-1" />
        <button onClick={() => setDir(dir === 'rtl' ? 'ltr' : 'rtl')} className="px-2 py-1 text-xs border rounded" title="Toggle direction">{dir === 'rtl' ? 'RTL' : 'LTR'}</button>
      </div>
      <div className="flex-1 overflow-auto p-6 bg-background">
        <EditorContent editor={editor} className="tiptap-wrapper" />
      </div>
    </div>
  )
}
