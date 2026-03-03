import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Button from './Button';

export default function TipTapEditor({
  value = '',
  onChange,
  placeholder = 'Write something...',
  disabled = false,
}) {
  const editor = useEditor({
    extensions: [
      Color.configure({ types: ['textStyle'] }),
      TextStyle,
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: true,
      }),
      Underline,
      Link.configure({ openOnClick: true, autolink: true, defaultProtocol: 'https' }),
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
    ],
    editable: !disabled,
    content: value || '<p></p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChange) onChange({ target: { value: html } });
    },
  });

  const applyLink = () => {
    if (!editor) return;
    const url = window.prompt('Enter URL');
    if (!url) return;
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const clearLink = () => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  };

  const addImage = async (e) => {
    if (!editor) return;
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result || '');
      editor.chain().focus().setImage({ src }).run();
    };
    reader.readAsDataURL(file);
  };

  if (!editor) return null;

  return (
    <div className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex flex-wrap items-center gap-1 border-b border-[var(--color-border)] p-2 text-sm">
        <Button
          size="sm"
          variant="subtle"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          disabled={!editor.can().chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </Button>
        <Button
          size="sm"
          variant="subtle"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={!editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </Button>
        <Button
          size="sm"
          variant="subtle"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          disabled={!editor.can().chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </Button>
        <span className="mx-1 h-5 w-px bg-[var(--color-border)]" />
        <Button
          size="sm"
          variant="subtle"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          B
        </Button>
        <Button
          size="sm"
          variant="subtle"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        >
          I
        </Button>
        <Button
          size="sm"
          variant="subtle"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
        >
          U
        </Button>
        <span className="mx-1 h-5 w-px bg-[var(--color-border)]" />
        <Button
          size="sm"
          variant="subtle"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </Button>
        <Button
          size="sm"
          variant="subtle"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          Code
        </Button>
        <span className="mx-1 h-5 w-px bg-[var(--color-border)]" />
        <Button
          size="sm"
          variant="subtle"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullet
        </Button>
        <Button
          size="sm"
          variant="subtle"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Numbered
        </Button>
        <Button
          size="sm"
          variant="subtle"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          HR
        </Button>
        <span className="mx-1 h-5 w-px bg-[var(--color-border)]" />
        <Button size="sm" variant="subtle" onClick={() => editor.chain().focus().undo().run()}>
          Undo
        </Button>
        <Button size="sm" variant="subtle" onClick={() => editor.chain().focus().redo().run()}>
          Redo
        </Button>
        <span className="mx-1 h-5 w-px bg-[var(--color-border)]" />
        <Button size="sm" variant="subtle" onClick={applyLink}>
          Link
        </Button>
        <Button size="sm" variant="subtle" onClick={clearLink}>
          Unlink
        </Button>
        <label className="ml-2 inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] border border-dashed border-[var(--color-border)] px-2 py-1">
          Image
          <input type="file" accept="image/*" className="hidden" onChange={addImage} />
        </label>
      </div>
      <div className="prose prose-sm max-w-none p-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
