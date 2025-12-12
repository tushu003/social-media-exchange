"use client";

import React, { useState } from "react";
import { TabType, Section, INITIAL_SECTION } from "./types";
import TabHeader from "./components/TabHeader";
import AddSectionButton from "./components/AddSectionButton";
import SectionsList from "./components/SectionsList";
import EditorModal from "./components/EditorModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import {
  useCreateTermsMutation,
  useGetTermsQuery,
  useUpdateTermsMutation,
  useDeleteTermsMutation,
} from "@/src/redux/features/termsAndPrivacy/termsApi";
import {
  useCreatePrivacyMutation,
  useGetPrivacyQuery,
  useUpdatePrivacyMutation,
  useDeletePrivacyMutation,
} from "@/src/redux/features/termsAndPrivacy/privacyApi";
import { toast } from "sonner";

export default function AdminTermsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("terms");

  return (
    <div className="bg-white text-[#1D1F2C] min-h-screen px-4 md:px-12 py-10">
      <TabHeader activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "terms" ? <TermsContent /> : <PrivacyPolicyContent />}
    </div>
  );
}

function TermsContent() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [currentSection, setCurrentSection] =
    useState<Section>(INITIAL_SECTION);
  const [sectionToDelete, setSectionToDelete] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  // RTK Query hooks
  const [createTerms, { isLoading: isCreating }] = useCreateTermsMutation();
  const [updateTerms, { isLoading: isUpdating }] = useUpdateTermsMutation();
  const [deleteTerms, { isLoading: isDeleting }] = useDeleteTermsMutation();
  const { data: termsData, isLoading: isLoadingTerms } =
    useGetTermsQuery(undefined);

  const handleEditorChange = (content: string) => {
    // console.log("Editor Content Changed:", content);
    setCurrentSection((prev) => ({ ...prev, content }));
  };

  const handleTitleChange = (title: string) => {
    setCurrentSection((prev) => ({ ...prev, title }));
  };

  const handleEdit = (section: Section) => {
    setCurrentSection(section);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const { title, content, _id } = currentSection;
    // console.log("Attempting to save section:", currentSection);

    if (!title.trim() || !content.trim()) {
      // console.log("Validation Failed: Empty title or content");
      toast.error("Please fill in both title and content");
      return;
    }

    try {
      if (isEditing && _id) {
        await updateTerms({
          _id,
          title,
          content,
        }).unwrap();
        toast.success("Terms section updated successfully!");
      } else {
        await createTerms({
          title,
          content,
        }).unwrap();
        toast.success("Terms section created successfully!");
      }

      setCurrentSection(INITIAL_SECTION);
      setIsModalOpen(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save terms:", error);
      toast.error(`Failed to ${isEditing ? "update" : "create"} terms section`);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentSection(INITIAL_SECTION);
  };

  const handleDeleteClick = (id: string) => {
    setSectionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTerms(sectionToDelete).unwrap();
      toast.success("Terms section deleted successfully!");
      setIsDeleteModalOpen(false);
      setSectionToDelete("");
    } catch (error) {
      console.error("Failed to delete terms:", error);
      toast.error("Failed to delete terms section");
    }
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setSectionToDelete("");
  };

  if (isLoadingTerms) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20B894]"></div>
      </div>
    );
  }

  return (
    <>
      <AddSectionButton
        onClick={() => setIsModalOpen(true)}
        disabled={isCreating || isUpdating || isDeleting}
      />

      <SectionsList
        sections={termsData?.data || []}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        isDeleting={isDeleting}
      />

      {isModalOpen && (
        <EditorModal
          section={currentSection}
          onTitleChange={handleTitleChange}
          onContentChange={handleEditorChange}
          onSave={handleSave}
          onClose={handleModalClose}
          isLoading={isCreating || isUpdating}
          isEditing={isEditing}
        />
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </>
  );
}

function PrivacyPolicyContent() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [currentSection, setCurrentSection] =
    useState<Section>(INITIAL_SECTION);
  const [sectionToDelete, setSectionToDelete] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  // RTK Query hooks for Privacy
  const [createPrivacy, { isLoading: isCreating }] = useCreatePrivacyMutation();
  const [updatePrivacy, { isLoading: isUpdating }] = useUpdatePrivacyMutation();
  const [deletePrivacy, { isLoading: isDeleting }] = useDeletePrivacyMutation();
  const { data: privacyData, isLoading: isLoadingPrivacy } =
    useGetPrivacyQuery(undefined);

  const handleEditorChange = (content: string) => {
    setCurrentSection((prev) => ({ ...prev, content }));
  };

  const handleTitleChange = (title: string) => {
    setCurrentSection((prev) => ({ ...prev, title }));
  };

  const handleEdit = (section: Section) => {
    setCurrentSection(section);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const { title, content, _id } = currentSection;

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }

    try {
      if (isEditing && _id) {
        await updatePrivacy({
          _id,
          title,
          content,
        }).unwrap();
        toast.success("Privacy section updated successfully!");
      } else {
        await createPrivacy({
          title,
          content,
        }).unwrap();
        toast.success("Privacy section created successfully!");
      }

      setCurrentSection(INITIAL_SECTION);
      setIsModalOpen(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save privacy:", error);
      toast.error(
        `Failed to ${isEditing ? "update" : "create"} privacy section`
      );
    }
  };

  const handleDeleteClick = (id: string) => {
    setSectionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePrivacy(sectionToDelete).unwrap();
      toast.success("Privacy section deleted successfully!");
      setIsDeleteModalOpen(false);
      setSectionToDelete("");
    } catch (error) {
      console.error("Failed to delete privacy:", error);
      toast.error("Failed to delete privacy section");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentSection(INITIAL_SECTION);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setSectionToDelete("");
  };

  if (isLoadingPrivacy) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20B894]"></div>
      </div>
    );
  }

  return (
    <>
      <AddSectionButton
        onClick={() => setIsModalOpen(true)}
        disabled={isCreating || isUpdating || isDeleting}
      />

      <SectionsList
        sections={privacyData?.data || []}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        isDeleting={isDeleting}
      />

      {isModalOpen && (
        <EditorModal
          section={currentSection}
          onTitleChange={handleTitleChange}
          onContentChange={handleEditorChange}
          onSave={handleSave}
          onClose={handleModalClose}
          isLoading={isCreating || isUpdating}
          isEditing={isEditing}
        />
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </>
  );
}
