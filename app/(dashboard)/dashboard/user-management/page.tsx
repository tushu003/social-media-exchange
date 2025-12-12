"use client";

import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import { useGetAllUsersQuery } from "@/src/redux/features/users/userApi";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Pagination } from "@/components/reusable/pagination";
import { verifiedUser } from "@/src/utils/token-varify";

export default function UserManagement() {
  const { data: users, isLoading, error, refetch: refetchUsers } = useGetAllUsersQuery({});
  const currentUser = verifiedUser();
  useEffect(() => {
    refetchUsers();
  }, []);

  // Filter out the current user from the users list
  const filteredUsers =
    users?.data?.filter((user) => user._id !== currentUser?.userId) || [];

  const usersPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // console.log("selectedUser", selectedUser);

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="p-3 sm:p-5 bg-white">
        {/* Table Container */}
        <div className="overflow-x-auto rounded-lg sm:rounded-xl bg-white">
          <table className="w-full text-left">
            <thead className="bg-[#FAFAFA] text-xs sm:text-sm text-gray-600 uppercase">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Name</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Email</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm">
              {currentUsers.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 relative rounded-full overflow-hidden">
                        {user?.profileImage ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${user?.profileImage}`}
                            alt={user?.first_name || "User"}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                            priority
                            quality={100}
                          />
                        ) : (
                          <div className="w-full h-full bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-base sm:text-lg font-medium">
                            {(user?.first_name?.charAt(0) || "U").toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="truncate">{user.first_name}</div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 truncate">
                    {user.email}
                  </td>
                  <td
                    onClick={() => openModal(user)}
                    className="px-4 sm:px-6 py-3 sm:py-4 text-green-600 hover:underline cursor-pointer"
                  >
                    View details
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-3 sm:mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Modal */}
        {isModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 w-full max-w-[420px] relative shadow-xl">
              <button
                onClick={closeModal}
                className="absolute right-3 sm:right-6 top-3 sm:top-6 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>

              <div className="flex flex-col items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                {selectedUser?.profileImage ? (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-emerald-50">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${selectedUser?.profileImage}`}
                      alt={selectedUser?.first_name || "User"}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-semibold ring-4 ring-emerald-50">
                    {selectedUser.first_name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div className="text-center">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {selectedUser.first_name}
                  </h2>
                  <p className="text-sm text-gray-500">{selectedUser?.email}</p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2 sm:mb-3">
                    User Information
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-500">User ID</span>
                      <span className="font-medium text-gray-900">
                        #{selectedUser._id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 font-medium">Services</span>
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] px-1.5 rounded-full">
                          {selectedUser.my_service?.length || 0}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.my_service?.map((service, index) => (
                          <span
                            key={index}
                            className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-medium shadow-sm hover:bg-emerald-100 transition-colors duration-200 cursor-default"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={closeModal}
                    className="w-full py-2 sm:py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
