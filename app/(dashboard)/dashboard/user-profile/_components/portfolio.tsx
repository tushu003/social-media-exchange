"use client";

import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useDeletePortfolioMutation,
  useUploadPortfolioMutation,
} from "@/src/redux/features/users/userApi";
import { verifiedUser } from "@/src/utils/token-varify";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGetSingleUserQuery } from "@/src/redux/features/users/userApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Portfolio() {
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false); // Add this line
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const currentUser = verifiedUser();
  const { data: userData } = useGetSingleUserQuery(currentUser?.userId);
  const [uploadPortfolio] = useUploadPortfolioMutation();

  const [deletePortfolio] = useDeletePortfolioMutation();
  const portfolioImage = userData?.data?.portfolio
    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${userData?.data?.portfolio}`
    : null;


  const handleUpload = async () => {
    if (!selectedFile || !currentUser?.userId) return;

    try {
      const formData = new FormData();
      formData.append('portfolio', selectedFile);
      formData.append('userId', currentUser.userId);

      const response = await uploadPortfolio({ 
        userId: currentUser.userId, 
        data: formData 
      }).unwrap();
      
      if (response.success) {
        toast.success('Portfolio uploaded successfully');
        setShowPortfolioModal(false);
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload portfolio');
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDeletePhoto = async () => {
    if (!currentUser?.userId) return;

    try {
      const response = await deletePortfolio({
        userId: currentUser.userId,
      }).unwrap();
      if (response.success) {
        toast.success("Portfolio deleted successfully");
        setShowDeleteAlert(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete portfolio");
    }
  };

  return (
    <>
      <Card className="p-6">
        <h2 className="text-lg font-medium mb-4">Portfolio</h2>

        {!portfolioImage ? (
          <p className="text-sm text-gray-500 mb-4">
            Upload necessary documents or photos to showcase your
            portfolio/services.
          </p>
        ) : (
          <div className="mb-4">
            <div className="relative w-40 h-40 rounded-lg overflow-hidden">
              <Image
                src={portfolioImage}
                alt="Portfolio"
                fill
                className="object-cover"
                onError={(e: any) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement.innerHTML = `
                    <div class="w-full h-full bg-[#20B894] flex items-center justify-center text-white text-lg font-medium">
                      Portfolio
                    </div>
                  `;
                }}
              />
              <button
                onClick={() => setShowDeleteAlert(true)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setShowPortfolioModal(true)}
            className="px-3 py-1.5 text-sm text-[#20B894] border border-[#20B894] rounded-md flex items-center gap-2 cursor-pointer hover:bg-[#20B894] hover:text-white ease-in duration-300"
          >
            {portfolioImage ? "Change Image" : "Add file"}
          </button>
        </div>
      </Card>

      {/* Portfolio Modal */}
      <Dialog open={showPortfolioModal} onOpenChange={setShowPortfolioModal}>
        <DialogContent className="md:max-w-[825px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Add Portfolio
            </DialogTitle>
            <button
              onClick={() => setShowPortfolioModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-base font-medium mb-1 block">Media</label>
              <div className="mt-1 border rounded-lg p-4">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*,video/*,application/pdf"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center"
                >
                  <span className="bg-white px-3 py-2 rounded border hover:bg-gray-50">
                    Choose files
                  </span>
                  <span className="ml-3 text-gray-500">
                    {selectedFile ? selectedFile.name : "No file chosen"}
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Maximum file size: 50 MB
                </p>

                {/* Preview Section */}
                {previewUrl && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="pt-4">
              <button
                onClick={handleUpload}
                disabled={!selectedFile}
                className={`px-4 py-2 text-white rounded-md w-24 cursor-pointer ${
                  selectedFile
                    ? "bg-[#20B894] hover:bg-[#1a9678]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {selectedFile ? "Upload" : "Add file"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              portfolio image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePhoto}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
