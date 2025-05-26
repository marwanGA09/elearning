'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import DOMPurify from 'dompurify';

import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListOrderedIcon,
  ListIcon,
  ChevronDown,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface TiptapProps {
  content: string;
  onChange: (content: string) => void;
}

const Tiptap = ({ content, onChange }: TiptapProps) => {
  const [headingLevel, setHeadingLevel] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const HeadingIcons = [
    <Heading1Icon />,
    <Heading2Icon />,
    <Heading3Icon />,
    <Heading4Icon />,
    <Heading5Icon />,
    <Heading6Icon />,
  ];
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const clean = DOMPurify.sanitize(html);
      onChange(clean);
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none min-h-[250px]',
      },
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col w-full p-2">
      <div className="flex space-x-2 mb-2">
        <div className="relative">
          <button
            type="button"
            className="p-2 flex items-baseline justify-center"
          >
            {HeadingIcons[headingLevel - 1]}
            <ChevronDown className="h-4 w-4 " />
          </button>
          <select
            value={headingLevel}
            onChange={(e) => {
              const level = Number(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6;
              setHeadingLevel(level);
              editor.chain().focus().toggleHeading({ level }).run();
            }}
            className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer"
          >
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <option key={level} value={level}>
                H{level}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
        >
          <BoldIcon />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
        >
          <ItalicIcon />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 ${editor.isActive('underline') ? 'bg-gray-300' : ''}`}
        >
          <UnderlineIcon />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 ${
            editor.isActive('bulletList') ? 'bg-gray-300' : ''
          }`}
        >
          <ListIcon />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 ${
            editor.isActive('orderedList') ? 'bg-gray-300' : ''
          }`}
        >
          <ListOrderedIcon />
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="chapter-description-form border rounded-lg p-2"
      />
    </div>
  );
};

export default Tiptap;
