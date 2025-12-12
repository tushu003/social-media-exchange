"use client";

import TextEditor from "./text-editor";
import { Section } from "../types";

interface EditorModalProps {
  section: Section;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
  onClose: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

export default function EditorModal({
  section,
  onTitleChange,
  onContentChange,
  onSave,
  onClose,
  isLoading,
  isEditing,
}: EditorModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isEditing ? "Edit Section" : "Add New Section"}
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
            Section Title
          </label>
          <input
            type="text"
            value={section.title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter section title"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none 
                     focus:ring-2 focus:ring-[#20B894]"
          />
        </div>

        <TextEditor
          value={section.content}
          onChange={onContentChange}
          placeholder="Write your section content here..."
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`px-4 py-2 text-gray-600 border rounded-full cursor-pointer
                     ${
                       isLoading
                         ? "opacity-50 cursor-not-allowed"
                         : "hover:bg-gray-50"
                     }`}
          >
            Cancel
          </button>
          <button
            className={`bg-[#20B894] text-white px-4 py-2 rounded-full 
                     flex items-center gap-2
                     ${
                       isLoading
                         ? "opacity-75 cursor-not-allowed"
                         : "hover:bg-[#198d70]"
                     }`}
            onClick={onSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin cursor-not-allowed"></span>
                {isEditing ? "Updating..." : "Saving..."}
              </>
            ) : isEditing ? (
              <p className="cursor-pointer">Update Section</p>
            ) : (
              <p className="cursor-pointer">Save Section</p>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
