import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';

export default function RichTextEditor({ value, onChange, disabled }) {
  const editor = useEditor({
    editable: !disabled,
    extensions: [
      Color.configure({ types: ['textStyle'] }),
      TextStyle,
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({ openOnClick: true, autolink: true, HTMLAttributes: { rel: 'noopener' } }),
      Image.configure({ inline: false, allowBase64: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Write your content…' }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange({ target: { value: html } });
    },
  });

  React.useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || '';
    if (current !== next) editor.commands.setContent(next, false);
  }, [value, editor]);

  React.useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  const promptLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href || '';
    const url = window.prompt('Enter URL', prev);
    if (url === null) return; // cancel
    if (url === '') editor.chain().focus().unsetLink().run();
    else editor.chain().focus().setLink({ href: url }).run();
  };

  const insertImage = () => {
    if (!editor) return;
    const url = window.prompt('Image URL');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  if (!editor) return null;

  return (
    <div className="w-full">
      <div className="mb-2 flex flex-wrap items-center gap-1">
        <button
          className="rounded border px-2 py-1 text-sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </button>
        <button
          className="rounded border px-2 py-1 text-sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
        <button
          className="rounded border px-2 py-1 text-sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </button>
        <button
          className="rounded border px-2 py-1 text-sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          className="rounded border px-2 py-1 text-sm italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          className="rounded border px-2 py-1 text-sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
        >
          Underline
        </button>
        <button
          className="rounded border px-2 py-1 text-sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </button>
        <button
          className="rounded border px-2 py-1 text-sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          Code
        </button>
        <button
          className="rounded border px-2 py-1 text-sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </button>
        <button
          className="rounded border px-2 py-1 text-sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </button>
        <button
          className="rounded border px-2 py-1 text-sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          Left
        </button>
        <button
          className="rounded border px-2 py-1 text-sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          Center
        </button>
        <button
          className="rounded border px-2 py-1 text-sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          Right
        </button>
        <button className="rounded border px-2 py-1 text-sm" onClick={promptLink}>
          Link
        </button>
        <button className="rounded border px-2 py-1 text-sm" onClick={insertImage}>
          Image URL
        </button>
        <label className="rounded border px-2 py-1 text-sm cursor-pointer">
          Upload
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                const src = reader.result;
                if (src) editor.chain().focus().setImage({ src }).run();
              };
              reader.readAsDataURL(file);
              e.currentTarget.value = '';
            }}
            className="hidden"
          />
        </label>
        <button
          className="rounded border px-2 py-1 text-sm"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        >
          Clear
        </button>
      </div>
      <div className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <EditorContent editor={editor} className="min-h-[160px] p-2" />
      </div>
    </div>
  );
}
