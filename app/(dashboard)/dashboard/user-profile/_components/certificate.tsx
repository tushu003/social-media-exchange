'use client';

import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDeleteCertificateMutation, useUploadCertificateMutation } from "@/src/redux/features/users/userApi";
import { verifiedUser } from "@/src/utils/token-varify";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGetSingleUserQuery } from "@/src/redux/features/users/userApi";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function Certificate() {
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const currentUser = verifiedUser();
  const { data: userData } = useGetSingleUserQuery(currentUser?.userId);
  const [uploadCertificate] = useUploadCertificateMutation();
  const [deleteCertificate] = useDeleteCertificateMutation();

  const certificateImage = userData?.data?.cartificate 
    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${userData?.data?.cartificate}`
    : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !currentUser?.userId) return;

    try {
      const formData = new FormData();
      formData.append('cartificate', selectedFile);
      formData.append('userId', currentUser.userId);

      const response = await uploadCertificate({ 
        userId: currentUser.userId, 
        data: formData 
      }).unwrap();
      
      if (response.success) {
        toast.success('Certificate uploaded successfully');
        setShowCertificateModal(false);
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload certificate');
    }
  };

  const handleDeleteCertificate = async () => {
    if (!currentUser?.userId) return;

    try {
      const response = await deleteCertificate({ userId: currentUser?.userId }).unwrap();
      if (response.success) {
        toast.success('Certificate deleted successfully');
        setShowDeleteAlert(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete certificate');
    }
  };

  return (
    <>
      <Card className="p-6">
        <h2 className="text-lg font-medium mb-4">Certificate</h2>
        
        {!certificateImage ? (
          <p className="text-sm text-gray-500 mb-4">
            Upload necessary documents or certificates to verify your service and profile.
          </p>
        ) : (
          <div className="mb-4">
            <div className="relative w-40 h-40 rounded-lg overflow-hidden">
              <Image
                src={certificateImage}
                alt="Certificate"
                fill
                className="object-cover"
                onError={(e: any) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement.innerHTML = `
                    <div class="w-full h-full bg-[#20B894] flex items-center justify-center text-white text-lg font-medium">
                      Certificate
                    </div>
                  `;
                }}
              />
              <button
                onClick={() => setShowDeleteAlert(true)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button 
            onClick={() => setShowCertificateModal(true)}
             className="px-3 py-1.5 text-sm text-[#20B894] border border-[#20B894] rounded-md flex items-center gap-2 cursor-pointer hover:bg-[#20B894] hover:text-white ease-in duration-300"
          >
            {certificateImage ? 'Change Image' : 'Add file'}
          </button>
        </div>
      </Card>

      {/* Certificate Modal */}
      <Dialog open={showCertificateModal} onOpenChange={setShowCertificateModal}>
        <DialogContent className="sm:max-w-[825px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold ">Add Certificate</DialogTitle>
            <button 
              onClick={() => setShowCertificateModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-base font-medium mb-1 block">Upload Certificate Image</label>
              <div className="mt-1 border rounded-lg p-4">
                <input
                  type="file"
                  id="certificate-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <label 
                  htmlFor="certificate-upload"
                  className="cursor-pointer inline-flex items-center"
                >
                  <span className="bg-white px-3 py-2 rounded border hover:bg-gray-50">
                    Choose Image
                  </span>
                  <span className="ml-3 text-gray-500">
                    {selectedFile ? selectedFile.name : 'No file chosen'}
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-2">Maximum file size: 50 MB</p>

                {/* Preview Section */}
                {previewUrl && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <Image
                        src={previewUrl}
                        alt="Certificate Preview"
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
                className={`px-4 py-2 text-white  rounded-md w-24 cursor-pointer ${
                  selectedFile 
                    ? 'bg-[#20B894] hover:bg-[#1a9678]' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {selectedFile ? 'Upload' : 'Add file'}
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
              This action cannot be undone. This will permanently delete your certificate image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCertificate}
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