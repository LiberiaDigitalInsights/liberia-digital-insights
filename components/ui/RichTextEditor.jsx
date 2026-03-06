"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
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
  FaUndo,
  FaRedo,
  FaEraser,
} from "react-icons/fa";
import { cn } from "@/lib/cn";

const MenuButton = ({ onClick, isActive, disabled, title, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      "p-2 rounded-lg transition-all duration-200",
      isActive
        ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
        : "text-muted hover:bg-brand-500/10 hover:text-brand-500",
    )}
  >
    {children}
  </button>
);

export default function RichTextEditor({
  value,
  onChange,
  disabled,
  placeholder = "Start writing your story...",
  className,
}) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      Color.configure({ types: ["textStyle"] }),
      TextStyle,
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: false,
        underline: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          rel: "noopener",
          target: "_blank",
          class: "text-brand-500 underline font-bold",
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-2xl shadow-xl my-8",
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-brand max-w-none focus:outline-none min-h-[300px] p-6 text-text font-medium leading-relaxed",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [disabled, editor]);

  if (!editor) return null;

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div
      className={cn(
        "w-full border border-border rounded-3xl overflow-hidden bg-surface shadow-sm focus-within:border-brand-500/50 transition-colors",
        className,
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/20 border-b border-border/50 sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center gap-0.5 px-2 border-r border-border/50">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="Bold"
          >
            <FaBold className="w-3.5 h-3.5" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="Italic"
          >
            <FaItalic className="w-3.5 h-3.5" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            title="Underline"
          >
            <FaUnderline className="w-3.5 h-3.5" />
          </MenuButton>
        </div>

        <div className="flex items-center gap-0.5 px-2 border-r border-border/50">
          {[1, 2, 3].map((level) => (
            <MenuButton
              key={level}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level }).run()
              }
              isActive={editor.isActive("heading", { level })}
              title={`Heading ${level}`}
            >
              <div className="flex items-center gap-0.5">
                <FaHeading className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black">{level}</span>
              </div>
            </MenuButton>
          ))}
        </div>

        <div className="flex items-center gap-0.5 px-2 border-r border-border/50">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <FaListUl className="w-3.5 h-3.5" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="Numbered List"
          >
            <FaListOl className="w-3.5 h-3.5" />
          </MenuButton>
        </div>

        <div className="flex items-center gap-0.5 px-2 border-r border-border/50">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            title="Quote"
          >
            <FaQuoteLeft className="w-3.5 h-3.5" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
            title="Code Block"
          >
            <FaCode className="w-3.5 h-3.5" />
          </MenuButton>
        </div>

        <div className="flex items-center gap-0.5 px-2 border-r border-border/50">
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            title="Align Left"
          >
            <FaAlignLeft className="w-3.5 h-3.5" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            title="Align Center"
          >
            <FaAlignCenter className="w-3.5 h-3.5" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            title="Align Right"
          >
            <FaAlignRight className="w-3.5 h-3.5" />
          </MenuButton>
        </div>

        <div className="flex items-center gap-0.5 px-2 border-r border-border/50">
          <MenuButton
            onClick={addLink}
            isActive={editor.isActive("link")}
            title="Link"
          >
            <FaLink className="w-3.5 h-3.5" />
          </MenuButton>
          <MenuButton onClick={addImage} title="Image">
            <FaImage className="w-3.5 h-3.5" />
          </MenuButton>
        </div>

        <div className="flex items-center gap-0.5 px-2">
          <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <FaUndo className="w-3.5 h-3.5" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <FaRedo className="w-3.5 h-3.5" />
          </MenuButton>
          <MenuButton
            onClick={() =>
              editor.chain().focus().clearNodes().unsetAllMarks().run()
            }
            title="Clear Formatting"
          >
            <FaEraser className="w-3.5 h-3.5" />
          </MenuButton>
        </div>
      </div>

      {/* Editor Area */}
      <EditorContent editor={editor} />

      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #94a3b8;
          pointer-events: none;
          height: 0;
          font-style: italic;
        }
        .ProseMirror {
          min-height: 300px;
          outline: none;
        }
        .prose blockquote {
          border-left: 4px solid var(--color-brand-500);
          padding-left: 1.5rem;
          font-style: italic;
          color: var(--color-muted);
        }
        .prose pre {
          background: #1e293b;
          color: #f8fafc;
          padding: 1.5rem;
          border-radius: 1rem;
          font-family: "JetBrains Mono", monospace;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}
