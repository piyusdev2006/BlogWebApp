import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import { Controller } from 'react-hook-form'

function TipTapToolbar({ editor }) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-2 bg-surface-2 border-b border-hairline text-ink-subtle select-none">
      {/* Bold */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2.5 py-1 rounded text-body-sm font-bold transition-colors cursor-pointer ${
          editor.isActive('bold') ? 'bg-primary/20 text-primary border border-primary/30' : 'hover:text-ink hover:bg-surface-1'
        }`}
        title="Bold (Ctrl+B)"
      >
        B
      </button>

      {/* Italic */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2.5 py-1 rounded text-body-sm italic transition-colors cursor-pointer ${
          editor.isActive('italic') ? 'bg-primary/20 text-primary border border-primary/30' : 'hover:text-ink hover:bg-surface-1'
        }`}
        title="Italic (Ctrl+I)"
      >
        I
      </button>

      {/* Strike */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`px-2.5 py-1 rounded text-body-sm line-through transition-colors cursor-pointer ${
          editor.isActive('strike') ? 'bg-primary/20 text-primary border border-primary/30' : 'hover:text-ink hover:bg-surface-1'
        }`}
        title="Strikethrough"
      >
        S
      </button>

      {/* Code inline */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`px-2 py-1 rounded text-caption font-mono transition-colors cursor-pointer ${
          editor.isActive('code') ? 'bg-primary/20 text-primary border border-primary/30' : 'hover:text-ink hover:bg-surface-1'
        }`}
        title="Inline Code"
      >
        &lt;/&gt;
      </button>

      <div className="w-px h-5 bg-hairline mx-1" />

      {/* Headings */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-2 py-1 rounded text-caption font-semibold transition-colors cursor-pointer ${
          editor.isActive('heading', { level: 1 }) ? 'bg-primary/20 text-primary border border-primary/30' : 'hover:text-ink hover:bg-surface-1'
        }`}
      >
        H1
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded text-caption font-semibold transition-colors cursor-pointer ${
          editor.isActive('heading', { level: 2 }) ? 'bg-primary/20 text-primary border border-primary/30' : 'hover:text-ink hover:bg-surface-1'
        }`}
      >
        H2
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-2 py-1 rounded text-caption font-semibold transition-colors cursor-pointer ${
          editor.isActive('heading', { level: 3 }) ? 'bg-primary/20 text-primary border border-primary/30' : 'hover:text-ink hover:bg-surface-1'
        }`}
      >
        H3
      </button>

      <div className="w-px h-5 bg-hairline mx-1" />

      {/* Lists */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 rounded text-caption transition-colors cursor-pointer ${
          editor.isActive('bulletList') ? 'bg-primary/20 text-primary border border-primary/30' : 'hover:text-ink hover:bg-surface-1'
        }`}
        title="Bullet List"
      >
        • List
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 rounded text-caption transition-colors cursor-pointer ${
          editor.isActive('orderedList') ? 'bg-primary/20 text-primary border border-primary/30' : 'hover:text-ink hover:bg-surface-1'
        }`}
        title="Numbered List"
      >
        1. List
      </button>

      {/* Code block */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`px-2 py-1 rounded text-caption font-mono transition-colors cursor-pointer ${
          editor.isActive('codeBlock') ? 'bg-primary/20 text-primary border border-primary/30' : 'hover:text-ink hover:bg-surface-1'
        }`}
        title="Code Block"
      >
        Code Block
      </button>

      {/* Blockquote */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`px-2.5 py-1 rounded text-caption italic transition-colors cursor-pointer ${
          editor.isActive('blockquote') ? 'bg-primary/20 text-primary border border-primary/30' : 'hover:text-ink hover:bg-surface-1'
        }`}
        title="Quote"
      >
        "Quote"
      </button>

      <div className="w-px h-5 bg-hairline mx-1" />

      {/* Undo / Redo */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="px-2 py-1 rounded text-body-sm hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        title="Undo"
      >
        ↩
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="px-2 py-1 rounded text-body-sm hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        title="Redo"
      >
        ↪
      </button>
    </div>
  );
}

function TipTapInner({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose-content min-h-[350px] p-4 bg-surface-1 focus:outline-none text-ink font-body",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="w-full rounded-md overflow-hidden border border-hairline bg-surface-1">
      <TipTapToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

export default function RTE({ name, control, label, defaultValue = "" }) {
  return (
    <div className="w-full">
      {label && (
        <label className="inline-block mb-1.5 pl-0.5 text-body-sm text-ink-muted font-medium">
          {label}
        </label>
      )}
      <Controller
        name={name || "content"}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <TipTapInner value={value || defaultValue} onChange={onChange} />
        )}
      />
    </div>
  );
}
