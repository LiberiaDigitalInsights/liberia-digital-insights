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
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaHeading,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaCode,
  FaLink,
  FaImage,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaEraser,
  FaUndo,
  FaRedo,
} from 'react-icons/fa';

export default function RichTextEditor({
  value,
  onChange,
  disabled,
  placeholder = 'Start typing...',
}) {
  const editor = useEditor({
    editable: !disabled,
    extensions: [
      Color.configure({ types: ['textStyle'] }),
      TextStyle,
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          rel: 'noopener',
          target: '_blank',
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange({ target: { value: html } });
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px]',
        style: 'color: #1f2937; line-height: 1.6;',
      },
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
    <div className="w-full border border-[var(--color-border)] rounded-lg overflow-hidden bg-white">
      {/* Professional Toolbar */}
      <div className="border-b border-[var(--color-border)] bg-gray-50 p-2">
        <div className="flex flex-wrap items-center gap-1">
          {/* Text Formatting Group */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <button
              className={`p-2 rounded transition-colors ${
                editor.isActive('bold')
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              title="Bold"
            >
              <FaBold className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded transition-colors ${
                editor.isActive('italic')
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              title="Italic"
            >
              <FaItalic className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded transition-colors ${
                editor.isActive('underline')
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              disabled={!editor.can().chain().focus().toggleUnderline().run()}
              title="Underline"
            >
              <FaUnderline className="w-4 h-4" />
            </button>
          </div>

          {/* Headings Group */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <button
              className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${
                editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-700' : ''
              }`}
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              title="Heading 1"
            >
              <FaHeading className="w-4 h-4" />
              <span className="text-xs ml-1">1</span>
            </button>
            <button
              className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${
                editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-700' : ''
              }`}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              title="Heading 2"
            >
              <FaHeading className="w-4 h-4" />
              <span className="text-xs ml-1">2</span>
            </button>
            <button
              className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${
                editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-700' : ''
              }`}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              title="Heading 3"
            >
              <FaHeading className="w-4 h-4" />
              <span className="text-xs ml-1">3</span>
            </button>
          </div>

          {/* Lists Group */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <button
              className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${
                editor.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : ''
              }`}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              title="Bullet List"
            >
              <FaListUl className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${
                editor.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : ''
              }`}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              title="Numbered List"
            >
              <FaListOl className="w-4 h-4" />
            </button>
          </div>

          {/* Elements Group */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <button
              className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${
                editor.isActive('blockquote') ? 'bg-blue-100 text-blue-700' : ''
              }`}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              title="Quote"
            >
              <FaQuoteLeft className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${
                editor.isActive('codeBlock') ? 'bg-blue-100 text-blue-700' : ''
              }`}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              title="Code Block"
            >
              <FaCode className="w-4 h-4" />
            </button>
          </div>

          {/* Alignment Group */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <button
              className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${
                editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-700' : ''
              }`}
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              title="Align Left"
            >
              <FaAlignLeft className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${
                editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-700' : ''
              }`}
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              title="Align Center"
            >
              <FaAlignCenter className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${
                editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-700' : ''
              }`}
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              title="Align Right"
            >
              <FaAlignRight className="w-4 h-4" />
            </button>
          </div>

          {/* Media Group */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <button
              className="p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors"
              onClick={promptLink}
              title="Insert Link"
            >
              <FaLink className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors"
              onClick={insertImage}
              title="Insert Image"
            >
              <FaImage className="w-4 h-4" />
            </button>
            <label
              className="p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
              title="Upload Image"
            >
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
              📎
            </label>
          </div>

          {/* Actions Group */}
          <div className="flex items-center gap-1">
            <button
              className="p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              title="Undo"
            >
              <FaUndo className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              title="Redo"
            >
              <FaRedo className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors"
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
              title="Clear Formatting"
            >
              <FaEraser className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="min-h-[200px] p-4 bg-white">
        <EditorContent editor={editor} className="prose prose-sm max-w-none focus:outline-none" />
      </div>

      <style>{`
        .ProseMirror {
          color: #1f2937 !important;
          min-height: 200px;
          padding: 0;
          outline: none;
          line-height: 1.6;
        }
        .ProseMirror p {
          margin: 0 0 1em 0;
          color: #1f2937 !important;
        }
        .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
          color: #111827 !important;
          font-weight: 600;
        }
        .ProseMirror ul, .ProseMirror ol {
          color: #1f2937 !important;
        }
        .ProseMirror blockquote {
          color: #4b5563 !important;
          border-left: 3px solid #d1d5db;
          padding-left: 1em;
          margin: 1em 0;
        }
        .ProseMirror code {
          background-color: #f3f4f6;
          color: #dc2626 !important;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-size: 0.9em;
        }
        .ProseMirror pre {
          background-color: #f3f4f6;
          color: #1f2937 !important;
          padding: 1em;
          border-radius: 4px;
          overflow-x: auto;
        }
        .ProseMirror a {
          color: #2563eb !important;
          text-decoration: underline;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}
