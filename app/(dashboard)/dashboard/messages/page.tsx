"use client";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import moment from "moment";
import { MessageList } from "./_components/MessageList";
import { MessageInput } from "./_components/MessageInput";
import { verifiedUser } from "@/src/utils/token-varify";
import { authApi } from "@/src/redux/features/auth/authApi";
import { MessageContent } from "./_components/MessageContent";
import ConfirmServiceModal from "./_components/confirm-service-modal";
import { toast } from "sonner";
import {
  useAcceptExchangeMutation,
  useUpdateExchangeUpdateDateForSerialMutation,
} from "@/src/redux/features/shared/exchangeApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
const socket = io("https://backend.ollivu.com");

const Messages = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [user, setUser] = useState(null);
  const [senderService, setSenderService] = useState(null);
  const [receiverService, setReceiverService] = useState(null);

  const [updateExchangeUpdateDateForSerial] =
    useUpdateExchangeUpdateDateForSerialMutation();

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  // console.log("currentChat", currentChat);

  const currentUser = verifiedUser();
  const router = useRouter();
  const [recipient, setRecipient] = useState(currentUser?.email);
  // TODO: check if the user is online or not
  const [finalQuery, setFinalQuery] = useState({
    userId: currentUser?.userId,
    isAccepted: true,
  });

  const getOtherUserEmail = (chat) => {
    return chat?.email === currentUser?.email
      ? chat?.reciverUserId?.email
      : chat?.senderUserId?.email;
  };

  const getOtherUserName = (chat) => {
    return chat?.email === currentUser?.email
      ? chat?.reciverUserId?.first_name
      : chat?.senderUserId?.first_name;
  };

  // TODO: get all message list data
  const { data: userList, refetch } = authApi.useGetAllExchangeDataQuery(
    finalQuery,
    { pollingInterval: 5000 }
  );
  const [acceptExchange] = useAcceptExchangeMutation();
  const users = userList?.data;
  // console.log("user list", users);
  // const

  const [unreadMessages, setUnreadMessages] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("unreadMessages");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const [lastMessages, setLastMessages] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lastMessages");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const [onlineUsers, setOnlineUsers] = useState({});

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    // Fetch user data on the client side
    const userData = verifiedUser();
    setUser(userData);
  }, []);

  // Fetch message history when component mounts or recipient changes
  useEffect(() => {
    if (recipient && currentUser?.email) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chats?email=${currentUser?.email}&recipient=${recipient}`
      )
        .then((response) => response.json())
        .then((data) => {
          setMessages(data);
          const lastMessagesMap = {};
          data.forEach((msg) => {
            const otherUser =
              msg.sender === currentUser?.email ? msg.recipient : msg.sender;
            if (
              !lastMessagesMap[otherUser] ||
              new Date(msg.timestamp) >
                new Date(lastMessagesMap[otherUser].timestamp)
            ) {
              lastMessagesMap[otherUser] = {
                content: msg.content,
                timestamp: msg.timestamp,
              };
            }
          });
          setLastMessages(lastMessagesMap);
        })
        .catch((error) => console.error("Error fetching messages:", error));
    }
  }, []);

  useEffect(() => {
    if (!currentUser?.email) return;

    // Initialize socket connection once
    socket.emit("join", currentUser?.email);
    socket.emit("user_online", currentUser?.email);

    // Setup event listeners
    const socketHandlers = {
      online_users: (users) => setOnlineUsers(users),
      user_connected: (email) =>
        setOnlineUsers((prev) => ({ ...prev, [email]: true })),
      user_disconnected: (email) =>
        setOnlineUsers((prev) => ({ ...prev, [email]: false })),
      message: (message) => {
        setMessages((prev) => [...prev, message]);

        if (
          !currentChat ||
          (message.sender !== getOtherUserEmail(currentChat) &&
            message.recipient !== getOtherUserEmail(currentChat))
        ) {
          const otherUser =
            message.sender === currentUser?.email
              ? message.recipient
              : message.sender;

          // TODO check 1
          if (currentUser?.email != message.sender) {
            // console.log("sojeb 1", currentUser?.email, message.sender);
            setUnreadMessages((prev) => {
              const newUnreadMessages = {
                ...prev,
                [otherUser]: (prev[otherUser] || 0) + 1,
              };
              localStorage.setItem(
                "unreadMessages",
                JSON.stringify(newUnreadMessages)
              );
              return newUnreadMessages;
            });
          }
        }

        const otherUser =
          message.sender === currentUser?.email
            ? message.recipient
            : message.sender;

        setLastMessages((prev) => {
          const newLastMessages = {
            ...prev,
            [otherUser]: {
              content: message.content,
              timestamp: message.timestamp,
            },
          };
          localStorage.setItem("lastMessages", JSON.stringify(newLastMessages));
          return newLastMessages;
        });
      },
      message_history: (history) => setMessages(history),
      message_deleted: (messageId) => {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      },
    };

    // Register all event listeners
    Object.entries(socketHandlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    // Fetch initial unread messages only once when component mounts
    const fetchInitialUnreadMessages = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/messages/unread/${currentUser?.email}`
        );
        const unreadCounts = await response.json();
        setUnreadMessages(unreadCounts);
        localStorage.setItem("unreadMessages", JSON.stringify(unreadCounts));
      } catch (error) {
        console.error("Error fetching initial unread messages:", error);
      }
    };

    fetchInitialUnreadMessages();

    // Cleanup function
    return () => {
      socket.emit("user_offline", currentUser?.email);
      Object.keys(socketHandlers).forEach((event) => {
        socket.off(event);
      });
    };
  }, [currentUser?.email]); // Remove currentChat and getOtherUserEmail from dependencies
  // Remove other duplicate useEffects related to socket events

  useEffect(() => {
    socket.on("message history", (history) => {
      setMessages(history);
    });

    socket.on("user list", (userList) => {
      // console.log("User list updated:", userList);
    });

    // TODO check 2
    // Fetch initial unread messages when component mounts
    const fetchInitialUnreadMessages = async () => {
      try {
        // Get unread messages count directly from the server
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/messages/unread/${currentUser?.email}`
        );
        const unreadCounts = await response.json();
        // console.log("Initial unread counts:", unreadCounts); // Debug log
        // Update unread messages state and localStorage
        setUnreadMessages(unreadCounts);
        localStorage.setItem("unreadMessages", JSON.stringify(unreadCounts));
      } catch (error) {
        console.error("Error fetching initial unread messages:", error);
      }
    };

    if (currentUser?.email) {
      fetchInitialUnreadMessages();
    }

    return () => {
      socket.emit("user_offline", currentUser?.email);
      socket.off("online_users");
      socket.off("user_connected");
      socket.off("user_disconnected");
      socket.off("message");
      socket.off("message history");
      socket.off("user list");
    };
  }, [currentUser?.email]);

  // TODO: send message function
  const sendMessage = async (e) => {
    e.preventDefault();
    if (message && currentChat) {
      // Determine sender/receiver services based on current user
      let senderService, reciverService;
      if (currentUser?.email === currentChat?.senderUserId?.email) {
        senderService = currentChat?.senderService || "N/A";
        reciverService = currentChat?.reciverService || "N/A";
      } else {
        senderService = currentChat?.reciverService || "N/A";
        reciverService = currentChat?.senderService || "N/A";
      }

      const messageData = {
        content: message,
        recipient: getOtherUserEmail(currentChat),
        sender: currentUser?.email,
        timestamp: new Date().toISOString(),
        read: false,
        senderService,
        reciverService,
      };

      console.log("send message:", messageData);

      socket.emit("message", messageData);
      await updateExchangeUpdateDateForSerial({
        recipient: messageData.recipient,
        sender: messageData.sender,
      });

      setMessage("");
    }
  };

  const handleChatSelect = async (user) => {
    console.log("selected user", user);
    setCurrentChat(user);
    console.log("currentChat", currentChat);

    try {
      const messagesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chats?email=${
          currentUser?.email
        }&recipient=${getOtherUserEmail(user)}`
      );
      const messagesData = await messagesResponse.json();
      setMessages(messagesData);

      // Mark messages as read for both users
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/messages/mark-read`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender: getOtherUserEmail(user),
            recipient: currentUser?.email,
          }),
        }
      );

      if (response.ok) {
        // Update local messages state
        setMessages((prevMessages) =>
          prevMessages.map((msg) => ({ ...msg, read: true }))
        );

        // Clear unread count for this conversation
        setUnreadMessages((prev) => {
          const newUnreadMessages = { ...prev };
          delete newUnreadMessages[getOtherUserEmail(user)];
          localStorage.setItem(
            "unreadMessages",
            JSON.stringify(newUnreadMessages)
          );
          return newUnreadMessages;
        });
      }
    } catch (error) {
      console.error("Error handling chat selection:", error);
    }
  };

  const deleteMessage = (messageId) => {
    socket.emit("delete_message", messageId);
  };

  useEffect(() => {
    socket.on("message_deleted", (messageId) => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== messageId)
      );
    });

    return () => {
      socket.off("message_deleted");
    };
  }, []);

  const handleReviewClick = (chat) => {
    if (!chat) return;

    const userId =
      chat?.email === currentUser?.email
        ? chat?.reciverUserId?._id
        : chat?.senderUserId?._id;

    if (userId) {
      router.push(`/service-result/${userId}`);
    }
  };

  const [isConfirmExchange, setIsConfirmExchange] = useState(false);

  const modalHandler = async (currentChat) => {
    if (currentChat?.senderUserId?.email === currentUser?.email) {
      const result = await acceptExchange({
        userId: currentUser?.userId,
        exchangeId: currentChat?._id,
      });
      if (result?.data?.success) {
        // Update currentChat state to reflect the change
        setCurrentChat((prev) => ({
          ...prev,
          senderUserAccepted: true,
        }));
        toast.success(result?.data?.message);
        refetch();
      }
    } else {
      setIsConfirmModalOpen(true);
    }
  };
  // console.log("currentChat", currentChat);

  return (
    <div className="flex flex-col bg-white">
      {/* Main Container - Responsive Grid Layout */}
      <div className="h-full grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12">
        {/* Left Sidebar - Messages List */}
        <div
          className={`
          ${currentChat ? "hidden" : "block"} 
          md:block 
          md:col-span-4 
          lg:col-span-3 
          border-r 
          border-gray-100
          h-full
          ${
            isSidebarOpen
              ? "fixed inset-0 z-50 bg-white md:relative md:z-auto"
              : ""
          }
        `}
        >
          <div className="h-full flex flex-col">
            {/* Mobile Header - Only visible on mobile when no chat is selected */}
            <div className="flex md:hidden items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg">Messages</h3>
              {isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Messages List */}
            {/* TODO: message list */}
            <div className="flex-1 overflow-y-auto">
              <MessageList
                onChatSelect={(user) => {
                  handleChatSelect(user);
                  setIsSidebarOpen(false);
                }}
                userData={userList?.data?.map((user) => {
                  let receiverEmail = "";
                  if (user.senderUserId?.email === currentUser?.email) {
                    receiverEmail = user.reciverUserId?.email;
                  } else {
                    receiverEmail = user.senderUserId?.email;
                  }

                  return {
                    ...user,
                    hasUnread: Boolean(unreadMessages[receiverEmail]),
                    lastMessage: lastMessages[receiverEmail],
                    isOnline: onlineUsers[receiverEmail] || false,
                    unreadCount: unreadMessages[receiverEmail] || 0,
                  };
                })}
                currentUser={currentUser?.email}
                userId={currentUser?.userId}
                userImage={undefined}
                activeChat={currentChat} // Add this line
              />
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div
          className={`
          ${!currentChat ? "hidden" : "flex"} 
          md:flex 
          flex-col 
          md:col-span-8 
          lg:col-span-6
          h-full
          relative
        `}
        >
          {currentChat ? (
            <>
              {/* Chat Header */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
                <div className="flex items-center p-4">
                  {/* Back Button - Mobile Only */}
                  <button
                    onClick={() => setCurrentChat(null)}
                    className="mr-3 md:hidden p-2 hover:bg-gray-100 rounded-full"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  {/* User Info */}
                  <div
                    onClick={() => setIsInfoModalOpen(true)}
                    className="flex items-center flex-1 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      {currentUser?.userId ===
                      currentChat?.senderUserId?._id ? (
                        currentChat?.reciverUserId?.profileImage ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${currentChat?.reciverUserId?.profileImage}`}
                            alt={currentChat?.reciverUserId?.first_name
                              ?.slice(0, 2)
                              .toUpperCase()}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#20b894] flex items-center justify-center">
                            <span className="text-white text-lg font-semibold">
                              {currentChat?.reciverUserId?.first_name
                                ?.slice(0, 2)
                                .toUpperCase() || "UN"}
                            </span>
                          </div>
                        )
                      ) : currentChat?.senderUserId?.profileImage ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${currentChat?.senderUserId?.profileImage}`}
                          alt={currentChat?.senderUserId?.first_name
                            ?.slice(0, 2)
                            .toUpperCase()}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#20b894] flex items-center justify-center">
                          <span className="text-white text-lg font-semibold">
                            {currentChat?.senderUserId?.first_name
                              ?.slice(0, 2)
                              .toUpperCase() || "UN"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-sm md:text-base">
                        {getOtherUserName(currentChat)}
                      </h3>
                      <span
                        className={`text-xs md:text-sm ${
                          onlineUsers[getOtherUserEmail(currentChat)]
                            ? "text-green-500"
                            : "text-gray-500"
                        }`}
                      >
                        {onlineUsers[getOtherUserEmail(currentChat)]
                          ? "Online"
                          : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Content */}
              <div className="">
                <MessageContent
                  messages={messages}
                  currentUser={currentUser}
                  currentChat={currentChat}
                  deleteMessage={deleteMessage}
                />
              </div>

              {/* TODO: Add the send message form */}
              {/* Message Input */}
              <div className="sticky bottom-0 bg-white border-t border-gray-100">
                <MessageInput
                  message={message}
                  setMessage={setMessage}
                  sendMessage={sendMessage}
                />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </div>

        {/* Right Sidebar - Details Panel */}
        <div className="hidden lg:block lg:col-span-3 border-l border-gray-100">
          <div className="h-full p-4">
            <h3 className="text-gray-500 mb-4">Details</h3>
            {currentChat && (
              <div className="bg-gray-50 p-6 rounded-xl">
                {/* Profile Content */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
                    {currentUser?.userId === currentChat?.senderUserId?._id ? (
                      currentChat?.reciverUserId?.profileImage ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${currentChat?.reciverUserId?.profileImage}`}
                          alt={currentChat?.reciverUserId?.first_name
                            ?.slice(0, 2)
                            .toUpperCase()}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#20b894] flex items-center justify-center">
                          <span className="text-white text-2xl font-semibold">
                            {currentChat?.reciverUserId?.first_name
                              ?.slice(0, 2)
                              .toUpperCase() || "UN"}
                          </span>
                        </div>
                      )
                    ) : currentChat?.senderUserId?.profileImage ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${currentChat?.senderUserId?.profileImage}`}
                        alt={currentChat?.senderUserId?.first_name
                          ?.slice(0, 2)
                          .toUpperCase()}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#20b894] flex items-center justify-center">
                        <span className="text-white text-2xl font-semibold">
                          {currentChat?.senderUserId?.first_name
                            ?.slice(0, 2)
                            .toUpperCase() || "UN"}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">
                    {getOtherUserName(currentChat)}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    {getOtherUserEmail(currentChat)}
                  </p>

                  {/* Action Buttons */}
                  <div className="w-full space-y-3">
                    <button
                      className={`
                        w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                        ${
                          (currentChat?.senderUserAccepted &&
                            currentChat?.reciverUserAccepted) ||
                          (currentUser?.userId ===
                            currentChat?.senderUserId?._id &&
                            currentChat?.senderUserAccepted) ||
                          (currentUser?.userId ===
                            currentChat?.reciverUserId?._id &&
                            currentChat?.reciverUserAccepted) ||
                          isConfirmExchange
                            ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                            : "bg-[#20b894] text-white hover:bg-[#1a9677] cursor-pointer"
                        }
                      `}
                      onClick={() => modalHandler(currentChat)}
                      disabled={
                        (currentChat?.senderUserAccepted &&
                          currentChat?.reciverUserAccepted) ||
                        (currentUser?.userId ===
                          currentChat?.senderUserId?._id &&
                          currentChat?.senderUserAccepted) ||
                        (currentUser?.userId ===
                          currentChat?.reciverUserId?._id &&
                          currentChat?.reciverUserAccepted) ||
                        isConfirmExchange
                      }
                    >
                      {currentChat?.senderUserAccepted &&
                      currentChat?.reciverUserAccepted
                        ? "Exchange Confirmed"
                        : (currentUser?.userId ===
                            currentChat?.senderUserId?._id &&
                            currentChat?.senderUserAccepted) ||
                          (currentUser?.userId ===
                            currentChat?.reciverUserId?._id &&
                            currentChat?.reciverUserAccepted) ||
                          isConfirmExchange
                        ? "Exchange in Progress"
                        : "Confirm Exchange Service"}
                    </button>
                    <button
                      className="w-full px-4 py-2.5 rounded-xl text-sm font-medium border border-[#b19c87] 
                        text-[#b19c87] hover:bg-[#b19c87] hover:text-white transition-colors cursor-pointer"
                      onClick={() => handleReviewClick(currentChat)}
                    >
                      Post Review
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Modals */}
      {currentChat &&
        isConfirmModalOpen &&
        currentUser?.email === currentChat?.reciverUserId?.email && (
          <ConfirmServiceModal
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            id={currentChat?._id}
            myServices={currentChat?.my_service || []}
            senderService={currentChat?.senderService || "No service selected"}
            acceptedService={currentChat?.service || "No service selected"}
            setIsConfirmExchange={setIsConfirmExchange}
          />
        )}

      {/* Info Modal - Mobile Only */}
      {isInfoModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Profile Details</h3>
              <button
                onClick={() => setIsInfoModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 p-6 rounded-xl text-center flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full relative overflow-hidden">
                  {currentUser?.userId === currentChat?.senderUserId?._id ? (
                    currentChat?.reciverUserId?.profileImage ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${currentChat?.reciverUserId?.profileImage}`}
                        alt={currentChat?.reciverUserId?.first_name
                          ?.slice(0, 2)
                          .toUpperCase()}
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-[#20b894] flex items-center justify-center">
                        <span className="text-white text-2xl font-semibold">
                          {currentChat?.reciverUserId?.first_name
                            ?.slice(0, 2)
                            .toUpperCase() || "UN"}
                        </span>
                      </div>
                    )
                  ) : currentChat?.senderUserId?.profileImage ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${currentChat?.senderUserId?.profileImage}`}
                      alt={currentChat?.senderUserId?.first_name
                        ?.slice(0, 2)
                        .toUpperCase()}
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#20b894] flex items-center justify-center">
                      <span className="text-white text-2xl font-semibold">
                        {currentChat?.senderUserId?.first_name
                          ?.slice(0, 2)
                          .toUpperCase() || "UN"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">
                    {getOtherUserName(currentChat)}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {getOtherUserEmail(currentChat)}
                  </p>
                </div>

                <div className="flex flex-col gap-3 w-full mt-4">
                  {/* {currentUser?.email === currentChat?.reciverUserId?.email || currentChat?.senderUserAccepted && currentChat?.reciverUserAccepted && ( */}
                  <button
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      currentChat?.senderUserAccepted &&
                      currentChat?.reciverUserAccepted
                        ? "bg-gray-200 text-gray-600"
                        : "bg-[#20b894] text-white active:bg-[#1a9677]"
                    }`}
                    onClick={() => {
                      modalHandler(currentChat);
                      setIsInfoModalOpen(false);
                    }}
                    disabled={
                      currentChat?.senderUserAccepted &&
                      currentChat?.reciverUserAccepted
                    }
                  >
                    {currentChat?.senderUserAccepted &&
                    currentChat?.reciverUserAccepted
                      ? "Exchange Confirmed"
                      : "Confirm Exchange Service"}
                  </button>
                  {/* )} */}

                  <button
                    className="px-4 py-2.5 rounded-xl text-sm font-medium border border-[#b19c87] text-[#b19c87] 
                    hover:bg-[#b19c87] hover:text-white transition-colors"
                    onClick={() => {
                      handleReviewClick(currentChat);
                      setIsInfoModalOpen(false);
                    }}
                  >
                    Post Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
