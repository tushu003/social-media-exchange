"use client";

import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { X as CloseIcon, X } from "lucide-react";
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
import { useGetAllCategoriesQuery } from "@/src/redux/features/categories/categoriesApi";
import Image from "next/image";
import {
  useDeleteUserServicesMutation,
  useUpdateUserServicesMutation,
} from "@/src/redux/features/users/userApi";
import { verifiedUser } from "@/src/utils/token-varify";
import { toast } from "sonner";

interface MyServiceProps {
  title?: string;
  description?: string;
  singleUser?: any; // Add proper type later
}

export default function MyService({ singleUser }: MyServiceProps) {
  // console.log("95", singleUser);

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState("");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState("");
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [serviceName, setServiceName] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const { data: getAllCategories, isLoading } =
    useGetAllCategoriesQuery(undefined);
  const categories = getAllCategories?.data || [];

  const validUser = verifiedUser();

  const { data: singleUserData } = useGetAllCategoriesQuery(validUser?.userId);
  // console.log("single", singleUserData?.data);


  const handleAddService = () => {
    setShowServiceModal(true);
  };

  const handleServiceSubmit = () => {
    if (newService.trim()) {
      setServices([...services, newService.trim()]);
      setNewService("");
      setShowServiceModal(false);
    }
  };

  const handleDeleteClick = (service: string) => {
    setServiceToDelete(service);
    setShowDeleteAlert(true);
  };

  // First, update the mutation hook
  const [deleteUserService] = useDeleteUserServicesMutation();
  
  // Then update the handleConfirmDelete function
  const handleConfirmDelete = async () => {
    try {
      const response = await deleteUserService({
        userId: validUser?.userId,
        data: {
          service: serviceToDelete
        }
      }).unwrap();
      // console.log("delete res", response);
      
  
      if (response.success) {
        setServices(services.filter((service) => service !== serviceToDelete));
        toast.success("Service deleted successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete service");
    }
    setShowDeleteAlert(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(
      expandedCategory === categoryName ? null : categoryName
    );
  };

  // Add these new hooks
  const [updateUserServices] = useUpdateUserServicesMutation();

  // Add this new function
  const handleSaveServices = async () => {
    try {
      const response = await updateUserServices({
        userId: validUser?.userId,
        data: {
          my_service: services,
        },
      }).unwrap();
      console.log("res", response);

      if (response.success) {
        toast.success("Services updated successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update services");
    }
  };
  useEffect(() => {
    if (singleUser?.my_service) {
      setServices(singleUser.my_service);
    }
  }, [singleUser]);

  // Add this new state for bulk delete
  const [showBulkDeleteAlert, setShowBulkDeleteAlert] = useState(false);
  
  // Add this new handler for bulk delete
  const handleBulkDelete = async () => {
    try {
      // Delete all services one by one
      for (const service of services) {
        await deleteUserService({
          userId: validUser?.userId,
          data: {
            service: service
          }
        }).unwrap();
      }
      
      setServices([]); // Clear all services
      toast.success("All services deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete services");
    }
    setShowBulkDeleteAlert(false);
  };
  
  // Update the services display section
  return (
    <>
      <Card className="p-2 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base lg:text-lg font-medium">My Services</h2>
          {services.length > 0 && (
            <button
              onClick={() => setShowBulkDeleteAlert(true)}
              className="px-3 py-1.5 text-xs md:text-sm text-red-500 border border-red-500 rounded-md hover:bg-red-50"
            >
              Remove All Services
            </button>
          )}
        </div>

        {/* Display services without individual delete buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="px-3 py-1.5 text-sm md:text-base bg-[#F5F5F5] rounded-full border border-gray-200"
            >
              <span>{service}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAddService}
            className="px-3 py-1.5 text-sm text-[#20B894] border border-[#20B894] rounded-md flex items-center gap-2 cursor-pointer hover:bg-[#20B894] hover:text-white ease-in duration-300"
          >
            Add Services
          </button>

          <button
            onClick={handleSaveServices}
             className="px-3 py-1.5 text-sm text-[#20B894] border border-[#20B894] rounded-md flex items-center gap-2 cursor-pointer hover:bg-[#20B894] hover:text-white ease-in duration-300"
          >
            Save
          </button>
        </div>
      </Card>

      {/* Updated Add Service Modal */}
      <Dialog open={showServiceModal} onOpenChange={setShowServiceModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Add My Service
            </DialogTitle>
            <button
              onClick={() => setShowServiceModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm mb-4">Choose services</p>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {categories.map((category) => (
                <div key={category._id} className="border rounded-lg">
                  <button
                    onClick={() => toggleCategory(category?.category_name)}
                    className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
                  >
                    <span className="text-lg font-medium">
                      {category?.category_name}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        expandedCategory === category?.category_name
                          ? "rotate-180"
                          : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {expandedCategory === category?.category_name && (
                    <div className="border-t">
                      {category.subCategories.map((subcat) => {
                        const isSelected = services.includes(
                          subcat?.subCategory
                        );
                        return (
                          <button
                            key={subcat._id}
                            onClick={() => {
                              if (!isSelected) {
                                setServices((prevServices) => [
                                  ...prevServices,
                                  subcat?.subCategory,
                                ]);
                                setShowServiceModal(false);
                              }
                            }}
                            disabled={isSelected}
                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${
                              isSelected
                                ? "opacity-50 cursor-not-allowed bg-gray-100"
                                : ""
                            }`}
                          >
                            {subcat?.subCategory}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button
                onClick={() => setShowServiceModal(false)}
                className="w-full px-4 py-2 bg-[#20B894] text-white rounded-md hover:bg-[#1a9678]"
              >
                Add Service
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the service "{serviceToDelete}". This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Add this new Alert Dialog for bulk delete */}
      <AlertDialog open={showBulkDeleteAlert} onOpenChange={setShowBulkDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove All Services?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your services. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
