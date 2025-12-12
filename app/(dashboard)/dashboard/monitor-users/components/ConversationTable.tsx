import { Button } from "@/components/ui/button";
import { StatusDropdown } from "./_StatusDropdown";
import { ViewDetailsModal } from "./ViewDetailsModal";
import { useState } from "react";
import Image from "next/image";
import { useTakeActionProfileReportMutation } from "@/src/redux/features/admin/profileReportApi";
import { toast } from "react-toastify";

interface ConversationTableProps {
  conversations: any[];
  isReportedView?: boolean;
  isSuspendedView?: boolean;
  suspendData?: any;
  open: { [key: string]: boolean };
  setOpen: (open: { [key: string]: boolean }) => void;
  onStatusChange: (id: string, status: string) => void;
  onTakeAction: (conversation: any) => void;
}

export function ConversationTable({
  conversations,
  suspendData,
  isReportedView = false,
  isSuspendedView = false,
  open,
  setOpen,
  onStatusChange,
}: ConversationTableProps) {
  console.log("conversations", conversations);

  const [viewDetailsModal, setViewDetailsModal] = useState<{
    isOpen: boolean;
    conversation: any;
  }>({
    isOpen: false,
    conversation: null,
  });

  // const [takeActionModal, setTakeActionModal] = useState<{isOpen: boolean; conversation: any}>({
  //   isOpen: false,
  //   conversation: null
  // });

  return (
    <>
      <div className="relative w-full">
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[600px] text-xs sm:text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b bg-gray-50">
                {isSuspendedView ? (
                  <>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 font-medium whitespace-nowrap">
                      #
                    </th>
                    <th className="px-2 sm:px-4 font-medium whitespace-nowrap">
                      User
                    </th>
                    <th className="px-2 sm:px-4 font-medium whitespace-nowrap">
                      Email
                    </th>
                    <th className="px-2 sm:px-4 font-medium whitespace-nowrap">
                      Reason
                    </th>
                    <th className="px-2 sm:px-4 font-medium whitespace-nowrap">
                      Suspended Date
                    </th>
                    <th className="px-2 sm:px-4 font-medium whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-2 sm:px-4 font-medium whitespace-nowrap">
                      Action
                    </th>
                  </>
                ) : isReportedView ? (
                  <>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 font-medium whitespace-nowrap">
                      #
                    </th>
                    <th className="px-2 sm:px-4 font-medium whitespace-nowrap">
                      Send Report User
                    </th>
                    <th className="px-2 sm:px-4 font-medium whitespace-nowrap">
                      Receive Report User
                    </th>
                    <th className="px-2 sm:px-4 font-medium whitespace-nowrap">
                      Reason
                    </th>
                    <th className="px-2 sm:px-4 font-medium whitespace-nowrap">
                      Report Date
                    </th>
                    <th className="px-2 sm:px-4 font-medium whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-2 sm:px-4 font-medium whitespace-nowrap">
                      Action
                    </th>
                  </>
                ) : (
                  <>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 font-medium whitespace-nowrap">
                      #
                    </th>
                    <th className="px-2 sm:px-4 font-medium whitespace-nowrap">
                      Sender Name
                    </th>
                    <th className="px-2 sm:px-4 font-medium whitespace-nowrap">
                      Receiver Name
                    </th>
                    <th className="px-2 sm:px-4 font-medium whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-2 sm:px-4 font-medium whitespace-nowrap">
                      Join Date
                    </th>
                    <th className="px-2 sm:px-4 font-medium whitespace-nowrap">
                      Action
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {conversations.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 sm:py-4 px-2 sm:px-4 whitespace-nowrap">
                    {index + 1}
                  </td>
                  {isSuspendedView ? (
                    <>
                      <td className="px-2 sm:px-4 whitespace-nowrap">
                        {item?.reportedId.first_name}
                      </td>
                      <td className="px-2 sm:px-4 whitespace-nowrap">
                        {item?.reportedId.email}
                      </td>
                      <td className="px-2 sm:px-4 whitespace-nowrap">
                        {item?.reportType}
                      </td>
                      <td className="px-2 sm:px-4 whitespace-nowrap">
                        <span className="text-sm font-medium">
                          {new Date(item?.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 whitespace-nowrap">
                        <span className="text-[10px] sm:text-xs px-2 py-1 rounded-full font-medium bg-red-100 text-yellow-600">
                          {item?.action}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 whitespace-nowrap">
                        <Button
                          variant="link"
                          className="p-0 text-[#4A4C56] hover:text-[#20B894] cursor-pointer text-[10px] sm:text-xs"
                          onClick={() =>
                            setViewDetailsModal({
                              isOpen: true,
                              conversation: item,
                            })
                          }
                        >
                          View details
                        </Button>
                      </td>
                    </>
                  ) : isReportedView ? (
                    <>
                      <td className="px-2 sm:px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-100 relative overflow-hidden">
                            {item?.reporterId?.profileImage ? (
                              <Image
                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.reporterId?.profileImage}`}
                                alt={item?.reporterId?.first_name || "User"}
                                fill
                                className="object-cover"
                                onError={(e: any) => {
                                  e.currentTarget.style.display = "none";
                                  e.currentTarget.parentElement.innerHTML = `<span class="flex h-full items-center justify-center text-lg font-medium text-gray-500">${
                                    item?.reporterId?.first_name?.charAt(0) ||
                                    "U"
                                  }</span>`;
                                }}
                              />
                            ) : (
                              <span className="flex h-full items-center justify-center text-lg font-medium text-gray-500">
                                {item?.reporterId?.first_name?.charAt(0) || "U"}
                              </span>
                            )}
                          </div>
                          {item?.reporterId?.first_name || "Anonymous"}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-100 relative overflow-hidden">
                            {item?.reportedId?.profileImage ? (
                              <Image
                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.reportedId?.profileImage}`}
                                alt={item?.reportedId?.first_name || "User"}
                                fill
                                className="object-cover"
                                onError={(e: any) => {
                                  e.currentTarget.style.display = "none";
                                  e.currentTarget.parentElement.innerHTML = `<span class="flex h-full items-center justify-center text-lg font-medium text-gray-500">${
                                    item?.reportedId?.first_name?.charAt(0) ||
                                    "U"
                                  }</span>`;
                                }}
                              />
                            ) : (
                              <span className="flex h-full items-center justify-center text-lg font-medium text-gray-500">
                                {item?.reportedId?.first_name?.charAt(0) || "U"}
                              </span>
                            )}
                          </div>
                          {item?.reportedId?.first_name || "Anonymous"}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 whitespace-nowrap">
                        {item.reason}
                      </td>
                      <td className="px-2 sm:px-4 whitespace-nowrap">
                        <p className="text-[#4A4C56] text-[10px] sm:text-xs">
                          {item.createdAt}
                        </p>
                      </td>
                      <td className="px-2 sm:px-4 whitespace-nowrap">
                        <p
                          className={`text-[#4A4C56] text-[10px] sm:text-xs ${
                            item.status === "blocked"
                              ? "text-red-500 font-bold"
                              : ""
                          }`}
                        >
                          {item.status}
                        </p>
                      </td>
                      <td className="px-2 sm:px-4 whitespace-nowrap">
                        <Button
                          variant="link"
                          className="p-0 text-[#4A4C56] hover:text-[#20B894] cursor-pointer text-[10px] sm:text-xs"
                          onClick={() =>
                            setViewDetailsModal({
                              isOpen: true,
                              conversation: item,
                            })
                          }
                        >
                          View details
                        </Button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-2 sm:px-4 whitespace-nowrap">
                        {item.user1}
                      </td>
                      <td className="px-2 sm:px-4 whitespace-nowrap">
                        {item.user2}
                      </td>
                      <td className="px-2 sm:px-4 whitespace-nowrap">
                        <p
                          className={`text-[10px] sm:text-xs px-2 py-1 rounded-full font-medium text-center ${
                            item.status === "Completed"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {item.status}
                        </p>
                      </td>
                      <td className="px-2 sm:px-4 whitespace-nowrap">
                        <p className="text-[#4A4C56] text-[10px] sm:text-xs">
                          {item.joinDate}
                        </p>
                      </td>
                      <td className="px-2 sm:px-4 whitespace-nowrap">
                        <Button
                          variant="link"
                          className="p-0 text-[#4A4C56] hover:text-[#20B894] cursor-pointer text-[10px] sm:text-xs"
                          onClick={() =>
                            setViewDetailsModal({
                              isOpen: true,
                              conversation: item,
                            })
                          }
                        >
                          View details
                        </Button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ViewDetailsModal
        isOpen={viewDetailsModal.isOpen}
        suspendData={[viewDetailsModal?.conversation]} // Only pass the selected user's data
        setViewDetailsModal={setViewDetailsModal}
        onClose={() =>
          setViewDetailsModal({ isOpen: false, conversation: null })
        }
        conversation={viewDetailsModal?.conversation}
        isReportedView={isReportedView}
        isSuspendedView={isSuspendedView}
      />
    </>
  );
}
