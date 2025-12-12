"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill/dist/quill.snow.css";

// Dynamic import with React 18 compatibility
const ReactQuill = dynamic(
  () =>
    import("react-quill").then((mod) => {
      const ReactQuill = mod.default;
      // Disable warning about findDOMNode
      ReactQuill.prototype.getEditingArea = function () {
        return this.editingArea;
      };
      return ReactQuill;
    }),
  {
    ssr: false,
    loading: () => <div className="h-[200px] border rounded-lg bg-gray-50" />,
  }
);

// Custom font sizes
const fontSizeArr = [
  "8px",
  "9px",
  "10px",
  "12px",
  "14px",
  "16px",
  "20px",
  "24px",
  "32px",
];

// Custom fonts
const fontFamilyArr = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Sans Serif",
  "Courier New",
  "Georgia",
  "Trebuchet MS",
  "Verdana",
];

// Quill Modules configuration
const modules = {
  toolbar: {
    container: [
      [{ font: fontFamilyArr }],
      [{ size: fontSizeArr }],
      [{ align: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "super" }, { script: "sub" }],
      ["blockquote", "code-block"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  },
};

// Quill Formats
const formats = [
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "align",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "blockquote",
  "code-block",
];

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextEditor = ({ value, onChange, placeholder }: TextEditorProps) => {
  const memoizedModules = useMemo(() => modules, []);

  return (
    <div className="bg-white">
      <style jsx global>{`
        .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          background-color: #f8f9fa;
          border: 1px solid #e2e8f0;
        }

        .ql-container {
          min-height: 200px;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          border: 1px solid #e2e8f0;
          border-top: none;
          font-size: 16px;
          font-family: Arial, sans-serif;
        }

        .ql-editor {
          min-height: 200px;
          padding: 1rem;
        }

        .ql-editor.ql-blank::before {
          color: #a0aec0;
          font-style: normal;
        }

        .ql-snow .ql-picker.ql-size .ql-picker-label::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item::before {
          content: attr(data-value) !important;
        }

        .ql-snow .ql-picker.ql-font .ql-picker-label::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item::before {
          content: attr(data-value) !important;
        }

        .ql-snow .ql-picker-label {
          padding-left: 8px;
          padding-right: 2px;
        }

        .ql-formats {
          margin-right: 12px !important;
        }

        .ql-snow .ql-formats button {
          width: 28px;
          height: 28px;
        }

        .ql-snow .ql-formats button:hover {
          color: #000;
        }

        .ql-snow .ql-formats button.ql-active {
          color: #20b894;
        }
      `}</style>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={memoizedModules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};

TextEditor.displayName = "TextEditor";

export default TextEditor;
