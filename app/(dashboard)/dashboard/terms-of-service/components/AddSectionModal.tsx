import React, { useState, useRef, useEffect } from "react";
import TextEditor from "./text-editor";

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string) => void;
  initialData?: {
    title: string;
    content: string;
  };
  mode: "section" | "subsection";
}

export default function AddSectionModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
}: AddSectionModalProps) {
  const [sectionTitle, setSectionTitle] = useState("");
  const editorRef = useRef<{ getHTML: () => string; clearContent: () => void }>(
    null
  );

  useEffect(() => {
    if (isOpen && initialData) {
      setSectionTitle(initialData.title);
      // You'll need to implement setContent in TextEditor
      // editorRef.current?.setContent(initialData.content);
    } else if (isOpen) {
      setSectionTitle("");
      editorRef.current?.clearContent();
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    if (!sectionTitle.trim()) {
      alert("Please enter a section title");
      return;
    }

    const content = editorRef.current?.getHTML() || "";
    onSave(sectionTitle, content);
    setSectionTitle("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {initialData
              ? `Edit ${mode === "section" ? "Section" : "Subsection"}`
              : `Add New ${mode === "section" ? "Section" : "Subsection"}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {mode === "section" ? "Section Title" : "Subsection Title"}
          </label>
          <input
            type="text"
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            placeholder={`Enter ${
              mode === "section" ? "section" : "subsection"
            } title`}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20B894]"
          />
        </div>

        <TextEditor value={initialData?.content} onChange={(content) => {}} />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border rounded-full hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-[#20B894] text-white px-4 py-2 rounded-full hover:bg-[#198d70]"
          >
            {initialData ? "Save Changes" : "Add Section"}
          </button>
        </div>
      </div>
    </div>
  );
}
