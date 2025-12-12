"use client";

import { X, Plus, Image as ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useCreateCategoryMutation, useGetAllCategoriesQuery } from "@/src/redux/features/categories/categoriesApi";
import {
  useCreateSubCategoryMutation,
  useRemoveSubCategoryMutation,
} from "@/src/redux/features/categories/subCategoryApi";

import { ChevronDown, ChevronRight } from "lucide-react";

interface SubCategory {
  _id?: string;  // Add ID for existing subcategories
  name: string;
  image: string | null;
}

interface Category {
  _id?: string;  // Add ID for existing categories
  name: string;
  subCategories: SubCategory[];
  currentInput: string;
}

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (categories: Omit<Category, "currentInput">[]) => void;
}

export function CategoriesModal({
  isOpen,
  onClose,
  onSave,
}: CategoriesModalProps) {
  // Add this state for tracking expanded categories
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  // Add this handler
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  const [categories, setCategories] = useState<Category[]>([
    { name: "", subCategories: [], currentInput: "" },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentImageUploadIndex, setCurrentImageUploadIndex] = useState<{
    category: number;
    sub: number;
  } | null>(null);

  const [createCategory] = useCreateCategoryMutation();
  const [subCategoryApi] = useCreateSubCategoryMutation();
  const [removeSubCategory] = useRemoveSubCategoryMutation();
  const {data: getAllCategories} = useGetAllCategoriesQuery({})
  const allCategories = getAllCategories?.data
  // console.log("all category fetch", allCategories);
  

  const handleAddCategory = async () => {
    if (categories.some((cat) => !cat.name.trim())) {
      toast.error("Please fill in the existing category name first");
      return;
    }

    try {
      const result = await createCategory({
        category_name: categories[categories.length - 1].name
      }).unwrap();

      if (result?._id) {
        const newCategories = [...categories];
        newCategories[categories.length - 1]._id = result._id;
        setCategories([...newCategories, { name: "", subCategories: [], currentInput: "" }]);
        toast.success("Category created successfully");
      }
    } catch (error) {
      toast.error("Failed to create category");
      console.error("Category creation error:", error);
    }
  };

  // Initialize categories with existing data
  useEffect(() => {
    if (allCategories?.length) {
      const formattedCategories = allCategories.map((cat: any) => ({
        _id: cat._id,
        name: cat.category_name,
        subCategories: cat.subCategories || [],
        currentInput: "",
      }));
      setCategories([...formattedCategories, { name: "", subCategories: [], currentInput: "" }]);
    }
  }, [allCategories]);

  const handleAddSubCategory = async (categoryIndex: number) => {
    const category = categories[categoryIndex];
    if (!category._id) {
      toast.error("Please save the category first");
      return;
    }
    
    if (!category.currentInput.trim()) {
      toast.error("Please enter a subcategory name");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("subCategory", category.currentInput);
      formData.append("categoryId", category._id); // Add categoryId to formData

      // Handle image upload
      if (currentImageUploadIndex && categories[currentImageUploadIndex.category].subCategories[currentImageUploadIndex.sub]?.image) {
        const imageBase64 = categories[currentImageUploadIndex.category].subCategories[currentImageUploadIndex.sub].image;
        const imageFile = await fetch(imageBase64!)
          .then(res => res.blob())
          .then(blob => new File([blob], "subcategory-image.jpg", { type: "image/jpeg" }));
        
        formData.append("categoryImage", imageFile);
      }

      const result = await subCategoryApi(formData).unwrap();

      if (result?._id) {
        const newCategories = [...categories];
        newCategories[categoryIndex].subCategories.push({
          _id: result._id,
          name: category.currentInput,
          image: null
        });
        newCategories[categoryIndex].currentInput = "";
        setCategories(newCategories);
        toast.success("Subcategory added successfully");
      }
    } catch (error) {
      toast.error("Failed to add subcategory");
      console.error("Subcategory creation error:", error);
    }
  };

  const handleRemoveSubCategory = async (categoryIndex: number, subCategoryIndex: number) => {
    const subCategory = categories[categoryIndex].subCategories[subCategoryIndex];
    
    if (!subCategory._id) {
      // If subcategory doesn't have an ID, it wasn't saved to backend yet
      const newCategories = [...categories];
      newCategories[categoryIndex].subCategories.splice(subCategoryIndex, 1);
      setCategories(newCategories);
      return;
    }

    try {
      await removeSubCategory({
        subCategorieId: subCategory._id
      }).unwrap();

      const newCategories = [...categories];
      newCategories[categoryIndex].subCategories.splice(subCategoryIndex, 1);
      setCategories(newCategories);
      toast.success("Subcategory removed successfully");
    } catch (error) {
      toast.error("Failed to remove subcategory");
      console.error("Subcategory removal error:", error);
    }
  };

  const handleConfirm = async () => {
    // Validate categories
    if (categories.some((cat) => !cat.name.trim())) {
      toast.error("Please fill in all category names");
      return;
    }

    if (categories.some((cat) => cat.subCategories.length === 0)) {
      toast.error("Each category must have at least one subcategory");
      return;
    }

    if (categories.some((cat) => cat.subCategories.some((sub) => !sub.image))) {
      toast.error("Please add images for all subcategories");
      return;
    }

    try {
      // Save any unsaved categories first
      for (const category of categories) {
        if (!category._id && category.name.trim()) {
          await handleAddCategory();
        }
      }

      // Save any unsaved subcategories
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        if (category._id) {
          for (const subCategory of category.subCategories) {
            if (!subCategory._id) {
              await handleAddSubCategory(i);
            }
          }
        }
      }

      onClose();
      toast.success("All changes saved successfully");
    } catch (error) {
      toast.error("Failed to save all changes");
      console.error("Save error:", error);
    }
  };

  const handleCategoryChange = (index: number, value: string) => {
    const newCategories = [...categories];
    newCategories[index].name = value;
    setCategories(newCategories);
  };

  const handleSubCategoryInputChange = (
    categoryIndex: number,
    value: string
  ) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].currentInput = value;
    setCategories(newCategories);
  };

  const handleRemoveCategory = (index: number) => {
    if (categories.length === 1) {
      toast.error("You must have at least one category");
      return;
    }
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleImageUpload = (categoryIndex: number, subIndex: number) => {
    setCurrentImageUploadIndex({ category: categoryIndex, sub: subIndex });
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentImageUploadIndex) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const newCategories = [...categories];
        newCategories[currentImageUploadIndex.category].subCategories[
          currentImageUploadIndex.sub
        ].image = base64;
        setCategories(newCategories);
      };
      reader.readAsDataURL(file);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[600px] max-h-[80vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Categories</h2>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-1 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />

        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              {category._id ? (
                <h3 className="text-lg font-medium flex-1">{category.name}</h3>
              ) : (
                <Input
                  placeholder="Category name"
                  value={category.name}
                  onChange={(e) => handleCategoryChange(categoryIndex, e.target.value)}
                  className="bg-white"
                />
              )}
              {!category._id && (
                <button
                  onClick={() => handleRemoveCategory(categoryIndex)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              {category.subCategories.map((subCategory, subIndex) => (
                <div
                  key={subIndex}
                  className="flex items-center gap-3 bg-white p-3 rounded-lg border"
                >
                  <div
                    className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden hover:bg-gray-200 transition-colors"
                    onClick={() => handleImageUpload(categoryIndex, subIndex)}
                    style={{ cursor: "pointer" }}
                  >
                    {subCategory.image ? (
                      <img
                        src={subCategory.image}
                        alt={subCategory.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <span className="flex-1 font-medium">{subCategory.name}</span>
                  <button
                    onClick={() =>
                      handleRemoveSubCategory(categoryIndex, subIndex)
                    }
                    className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add sub-category"
                  value={category.currentInput}
                  onChange={(e) =>
                    handleSubCategoryInputChange(categoryIndex, e.target.value)
                  }
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddSubCategory(categoryIndex);
                    }
                  }}
                  className="bg-white"
                />
                <Button
                  onClick={() => handleAddSubCategory(categoryIndex)}
                  className="bg-[#20B894] text-white hover:bg-[#1ca883]"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between mt-6">
          <Button
            onClick={handleAddCategory}
            variant="outline"
            className="text-[#20B894] border-[#20B894]"
          >
            Add Category
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-[#20B894] text-white hover:bg-[#1ca883]"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
