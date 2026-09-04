'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { useEffect, useState } from 'react'
import TurndownService from 'turndown'
import { marked } from 'marked'

const lowlight = createLowlight(common)
const turndownService = new TurndownService()

export function TiptapEditor({ content, onChange }: { content: string; onChange: (md: string) => void }) {
  const [status, setStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Link.configure({ openOnClick: false }),
      Image,
      Table.configure({ resizable: true }),
      TableRow, TableHeader, TableCell,
      TaskList, TaskItem.configure({ nested: true }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: marked.parse(content),
    onUpdate: ({ editor }) => {
      setStatus('unsaved')
      const md = turndownService.turndown(editor.getHTML())
      onChange(md)
    },
  })

  if (!editor) return null

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/30">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2 py-1 text-sm border rounded ${editor.isActive('bold') ? 'bg-foreground text-background' : ''}`}>B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2 py-1 text-sm border rounded ${editor.isActive('italic') ? 'bg-foreground text-background' : ''}`}>I</button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className="px-2 py-1 text-sm border rounded">S</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="px-2 py-1 text-sm border rounded">H1</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="px-2 py-1 text-sm border rounded">H2</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="px-2 py-1 text-sm border rounded">• List</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="px-2 py-1 text-sm border rounded">1. List</button>
        <button onClick={() => editor.chain().focus().toggleTaskList().run()} className="px-2 py-1 text-sm border rounded">☑</button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className="px-2 py-1 text-sm border rounded">❝</button>
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className="px-2 py-1 text-sm border rounded">{'</>'}</button>
        <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className="px-2 py-1 text-sm border rounded">Table</button>
        <span className="ml-auto text-xs text-muted-foreground self-center">{status}</span>
      </div>
      <div className="flex-1 overflow-auto p-6 prose prose-neutral dark:prose-invert max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
