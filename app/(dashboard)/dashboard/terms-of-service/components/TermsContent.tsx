"use client";

import React, { useState } from "react";
import AddSectionModal from "./AddSectionModal";

interface SectionType {
  id: string;
  title: string;
  content: string;
  subsections: Array<{
    id: string;
    title: string;
    content: string;
  }>;
}

export default function TermsContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSubsectionParentId, setEditingSubsectionParentId] = useState<
    string | null
  >(null);
  const [sections, setSections] = useState<SectionType[]>([]);

  const handleSaveSection = (title: string, content: string) => {
    if (editingSectionId) {
      // Edit existing section
      setSections(
        sections.map((section) =>
          section.id === editingSectionId
            ? { ...section, title, content }
            : section
        )
      );
      setEditingSectionId(null);
    } else if (editingSubsectionParentId) {
      // Add new subsection
      setSections(
        sections.map((section) =>
          section.id === editingSubsectionParentId
            ? {
                ...section,
                subsections: [
                  ...section.subsections,
                  {
                    id: Date.now().toString(),
                    title,
                    content,
                  },
                ],
              }
            : section
        )
      );
      setEditingSubsectionParentId(null);
    } else {
      // Add new section
      setSections([
        ...sections,
        {
          id: Date.now().toString(),
          title,
          content,
          subsections: [],
        },
      ]);
    }
    setIsModalOpen(false);
  };

  const handleEditSection = (sectionId: string) => {
    setEditingSectionId(sectionId);
    setIsModalOpen(true);
  };

  const handleDeleteSection = (sectionId: string) => {
    if (confirm("Are you sure you want to delete this section?")) {
      setSections(sections.filter((section) => section.id !== sectionId));
    }
  };

  const handleAddSubsection = (parentId: string) => {
    setEditingSubsectionParentId(parentId);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#20B894] text-white text-sm px-4 py-2 rounded-full hover:bg-[#198d70]"
        >
          Add Section
        </button>
      </div>

      {/* Sections */}
      {/* {sections.map((section) => (
        <Section
          key={section.id}
          title={section.title}
          content={section.content}
          subsections={section.subsections}
          onEdit={() => handleEditSection(section.id)}
          onDelete={() => handleDeleteSection(section.id)}
          onAddSubsection={() => handleAddSubsection(section.id)}
        />
      ))} */}

      {/* Add/Edit Section Modal */}
      <AddSectionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSectionId(null);
          setEditingSubsectionParentId(null);
        }}
        onSave={handleSaveSection}
        initialData={
          editingSectionId
            ? sections.find((s) => s.id === editingSectionId)
            : undefined
        }
        mode={editingSubsectionParentId ? "subsection" : "section"}
      />
    </div>
  );
}
