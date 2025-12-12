"use client";
import { ArrowRightLeft } from "lucide-react";
import moment from "moment";
import { useEffect, useRef } from "react";

export const MessageContent = ({
  messages,
  currentUser,
  currentChat,
  deleteMessage,
}) => {
  // console.log("currentChat MessageContent", currentChat?.senderUserId?.profileImage  );
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filterMessagesForChat = (messages, currentUser, currentChat) => {
    if (!currentChat || !currentUser) return [];
    return messages.filter((msg) => {
      const isCurrentUserSender = msg.sender === currentUser.email;
      const isCurrentUserRecipient = msg.recipient === currentUser.email;
      const otherUserEmail =
        currentChat.email === currentUser.email
          ? currentChat.reciverUserId?.email
          : currentChat.senderUserId?.email;

      return (
        (isCurrentUserSender && msg.recipient === otherUserEmail) ||
        (isCurrentUserRecipient && msg.sender === otherUserEmail)
      );
    });
  };
  return (
    <div
      className="flex-grow overflow-y-auto p-4 bg-[#F9FAFB] h-[560px] space-y-4"
      style={{ display: "flex", flexDirection: "column-reverse" }}
    >
      <div ref={messagesEndRef} />
      {filterMessagesForChat(messages, currentUser, currentChat)
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === currentUser?.email
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div className="max-w-[85%] group">
              <div className="relative">
                
                <div
                  className={`px-4 py-2.5 rounded-2xl shadow-sm break-words ${
                    msg.sender === currentUser?.email
                      ? "bg-[#20B894] text-white rounded-br-none"
                      : "bg-white rounded-bl-none border border-gray-100"
                  }`}
                >
                  <p className="text-[15px] leading-relaxed">{msg.content}</p>
                </div>
                <div>
                  <span className="text-[11px] flex items-center gap-3 text-gray-500">
                    <small>{msg?.senderService || "No service selected"}</small>{" "}
                    <ArrowRightLeft className="w-4 h-4" />{" "}
                    <small>
                      {msg?.reciverService || "No service selected"}
                    </small>
                  </span>
                </div>
                <div
                  className={`text-xs mt-1.5 ${
                    msg.sender === currentUser?.email
                      ? "text-right mr-2"
                      : "text-left ml-2"
                  } text-gray-500`}
                >
                  {moment(msg?.timestamp).format("DD MMM, h:mm A")}
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
