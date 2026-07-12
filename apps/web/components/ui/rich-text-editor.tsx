"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Unlink } from 'lucide-react'
import { cn } from '@/lib/cn'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export function RichTextEditor({ value, onChange, placeholder, minHeight = "120px" }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        dropcursor: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:underline cursor-pointer',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm prose-zinc max-w-none focus:outline-none py-3 px-3',
          '[&_p]:m-0 [&_ul]:my-1 [&_ul]:pl-5 [&_ol]:my-1 [&_ol]:pl-5 [&_li]:m-0',
        ),
        style: `min-height: ${minHeight};`,
      },
    },
  })

  if (!editor) {
    return null
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="border border-zinc-200 rounded-lg overflow-hidden focus-within:border-zinc-900 transition-all bg-white flex flex-col w-full">
      <div className="flex items-center gap-1 bg-zinc-50 border-b border-zinc-200 p-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "p-1.5 rounded hover:bg-zinc-200 transition-colors text-zinc-600",
            editor.isActive('bold') && "bg-zinc-200 text-zinc-900"
          )}
          title="Bold"
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "p-1.5 rounded hover:bg-zinc-200 transition-colors text-zinc-600",
            editor.isActive('italic') && "bg-zinc-200 text-zinc-900"
          )}
          title="Italic"
        >
          <Italic size={14} />
        </button>
        <div className="w-px h-4 bg-zinc-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "p-1.5 rounded hover:bg-zinc-200 transition-colors text-zinc-600",
            editor.isActive('bulletList') && "bg-zinc-200 text-zinc-900"
          )}
          title="Bullet List"
        >
          <List size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "p-1.5 rounded hover:bg-zinc-200 transition-colors text-zinc-600",
            editor.isActive('orderedList') && "bg-zinc-200 text-zinc-900"
          )}
          title="Numbered List"
        >
          <ListOrdered size={14} />
        </button>
        <div className="w-px h-4 bg-zinc-300 mx-1" />
        <button
          type="button"
          onClick={setLink}
          className={cn(
            "p-1.5 rounded hover:bg-zinc-200 transition-colors text-zinc-600",
            editor.isActive('link') && "bg-zinc-200 text-zinc-900"
          )}
          title="Link"
        >
          <LinkIcon size={14} />
        </button>
        {editor.isActive('link') && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="p-1.5 rounded hover:bg-zinc-200 transition-colors text-red-600"
            title="Remove Link"
          >
            <Unlink size={14} />
          </button>
        )}
      </div>
      <EditorContent editor={editor} className="flex-1 cursor-text w-full [&>div]:w-full" />
    </div>
  )
}
