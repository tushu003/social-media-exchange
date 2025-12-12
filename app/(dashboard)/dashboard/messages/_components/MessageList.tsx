"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  authApi,
  useGetAllExchangeDataQuery,
} from "@/src/redux/features/auth/authApi";
import { useExchangeChatRequestMutation } from "@/src/redux/features/shared/exchangeApi";
import { ArrowBigDown, ArrowRightLeft } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export const MessageList = ({
  onChatSelect,
  userData,
  currentUser,
  userId,
  userImage,
  activeChat, // Add this prop
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "messages";
  // console.log("userId", userId);
  // console.log("userData", userData);

  const [exchangeChatRequest, isLoading] = useExchangeChatRequestMutation();

  // console.log("user Data", userData);
  // console.log("user id", userId);
  const [finalQuery, setFinalQuery] = useState({
    userId: userId,
    isAccepted: true,
  });
  const { data } = useGetAllExchangeDataQuery(finalQuery);
  const { data: requestList, refetch } = useGetAllExchangeDataQuery(
    {
      userId: userId,
      isAccepted: false,
    },
    { pollingInterval: 5000 }
  );

  useEffect(() => {
    refetch();
  }, []);

  const [error, setError] = useState(null);

  const filteredUsers = userData
    ?.filter((user) =>
      (user?.email || "")
        .toLowerCase()
        .includes((searchTerm || "").toLowerCase())
    )
    .map((user) => ({
      ...user,
      unreadCount: user.hasUnread ? user.unreadCount || 0 : 0,
    }))
    .sort((a, b) => {
      const timeA = a.lastMessage?.timestamp || a.lastMessageTime || 0;
      const timeB = b.lastMessage?.timestamp || b.lastMessageTime || 0;

      return new Date(timeB).getTime() - new Date(timeA).getTime(); // Most recent first
    });

  if (!isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  const requestHandler = async (isAccepted, exchangeId) => {
    const data = {
      exchangeId,
      isAccepted,
      reciverUserId: userId,
    };
    const result = await exchangeChatRequest(data);
  };

  return (
    <div className="h-[calc(90vh-64px)] flex flex-col">
      {/* Search Bar - Fixed at top */}
      <div className="p-3 sm:p-4 bg-white border-b border-gray-100 z-20">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 sm:p-2.5 text-sm sm:text-base rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tabs Container */}
      <Tabs
        defaultValue={defaultTab}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TabsList className="w-full bg-white border-b rounded-none z-10">
          <TabsTrigger
            value="messages"
            className="flex-1 py-2 sm:py-3 text-sm sm:text-base data-[state=active]:border-b-2 border-l-0 border-r-0 border-t-0 rounded-none data-[state=active]:border-[#20b894] data-[state=active]:bg-white"
          >
            Messages
          </TabsTrigger>
          <TabsTrigger
            value="requests"
            className="flex-1 py-2 sm:py-3 text-sm sm:text-base data-[state=active]:border-b-2 border-l-0 border-r-0 border-t-0 rounded-none data-[state=active]:border-[#20b894] data-[state=active]:bg-white"
          >
            Requests
          </TabsTrigger>
        </TabsList>

        {/* Messages Tab Content - Scrollable */}
        <TabsContent value="messages" className="flex-1 overflow-auto">
          <div className="h-full">
            {filteredUsers?.map((user) => (
              <button
                key={user._id}
                onClick={() => onChatSelect(user)}
                className={`w-full text-left hover:bg-gray-50 p-3 sm:p-4 border-b border-gray-100 cursor-pointer ${
                  user.hasUnread ? "bg-blue-100" : ""
                } ${activeChat?._id === user._id ? "bg-emerald-50" : ""}`}
              >
                <div className="flex items-center gap-2 sm:gap-4">
                  {/* User Avatar */}
                  <div className="relative">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden">
                      {userId === user?.senderUserId?._id ? (
                        // If userId matches senderUserId, show reciverUserId's image
                        user?.reciverUserId?.profileImage ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${user?.reciverUserId?.profileImage}`}
                            alt="Profile"
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#20b894] flex items-center justify-center">
                            <span className="text-white text-lg font-medium">
                              {user?.reciverUserId?.first_name
                                ?.charAt(0)
                                .toUpperCase() || "U"}
                            </span>
                          </div>
                        )
                      ) : // If userId doesn't match senderUserId, show senderUserId's image
                      user?.senderUserId?.profileImage ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${user?.senderUserId?.profileImage}`}
                          alt="Profile"
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#20b894] flex items-center justify-center">
                          <span className="text-white text-lg font-medium">
                            {user?.senderUserId?.first_name
                              ?.charAt(0)
                              .toUpperCase() || "U"}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Online Status Indicator */}
                    <div
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white ${
                        user.isOnline ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3
                        className={`text-xs sm:text-sm ${
                          user.unreadCount > 0 ? "font-bold" : "font-medium"
                        } text-gray-900 truncate`}
                      >
                        {(user?.email === currentUser
                          ? user?.reciverUserId?.first_name
                          : user?.senderUserId?.first_name) || "Unknown"}{" "}
                        <span className="text-xs text-[#1677ff] ml-1">
                          (
                          {user?.email === currentUser
                            ? user?.reciverUserId?.role
                            : user?.senderUserId?.role}
                          )
                        </span>
                      </h3>
                      <span className="text-xs text-gray-500">
                        {user.lastMessage?.timestamp &&
                          new Date(
                            user.lastMessage.timestamp
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                      </span>
                    </div>
                    <p
                      className={`text-sm text-gray-500 truncate mt-1 ${
                        user.unreadCount > 0 ? "font-bold" : "font-normal"
                      }`}
                    >
                      {user?.email === currentUser
                        ? user?.reciverUserId?.email
                        : user?.email || "No messages yet"}
                    </p>

                    {/* TODO: show exchange services */}
                    <span className="text-[11px] flex items-center gap-3 text-gray-500">
                      <small>
                        {user?.senderService || "No service selected"}
                      </small>{" "}
                      <ArrowRightLeft className="w-4 h-4" />{" "}
                      <small>
                        {user?.reciverService || "No service selected"}
                      </small>
                    </span>
                  </div>

                  {/* Message Status */}
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500">
                      {user.lastMessageTime &&
                        new Date(user.lastMessageTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </span>

                    {user?.unreadCount > 0 &&
                      userId !== user?.senderId?._id && (
                        <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full mt-1">
                          {user.unreadCount}
                        </span>
                      )}
                  </div>
                </div>
              </button>
            ))}

            {userData?.data?.length === 0 && (
              <div className="text-center text-gray-500 p-3 sm:p-4 text-sm sm:text-base">
                {searchTerm ? "No chats found" : "No chats available"}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Requests Tab Content */}
        <TabsContent value="requests">
          <div className="flex flex-col">
            {requestList?.data?.map((request) => (
              <div
                key={request._id}
                className="p-3 sm:p-4 border-b border-gray-100"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full relative overflow-hidden">
                    {request?.senderUserId?.profileImage ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${request?.senderUserId?.profileImage}`}
                        alt={request?.senderUserId?.first_name
                          ?.slice(0, 2)
                          .toUpperCase()}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#20B894] flex items-center justify-center text-white font-semibold">
                        {request?.senderUserId?.first_name
                          ? request?.senderUserId.first_name
                              .slice(0, 2)
                              .toUpperCase()
                          : "UN"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-medium">
                      {request?.senderUserId?.first_name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-emerald-500">
                      {request?.senderUserId?.first_name} Sent You a Request
                    </p>
                    <span className="text-[10px] sm:text-xs text-gray-500">
                      {request.time}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => requestHandler("true", request._id)}
                    className="flex-1 py-1 sm:py-1.5 px-2 sm:px-3 text-xs sm:text-sm font-medium text-white bg-emerald-500 rounded-md hover:bg-emerald-600 cursor-pointer"
                  >
                    {/* {isLoading ? "Accepting..." : "Accept"} */}
                    Accept
                  </button>
                  <button
                    onClick={() => requestHandler("false", request._id)}
                    className="flex-1 py-1 sm:py-1.5 px-2 sm:px-3 text-xs sm:text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
                  >
                    {/* {isLoading ? "Declining..." : "Decline"} */}
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
