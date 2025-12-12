"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { socket } from "../socket";
import { FaRegCommentDots } from "react-icons/fa6";
import { useGetSingleUserQuery } from "@/src/redux/features/users/userApi";
import { verifiedUser } from "@/src/utils/token-varify";

const NotificationBadge = ({ currentUser }: { currentUser: string }) => {
  const [notifications, setNotifications] = useState<{
    [sender: string]: number;
  }>({});
  const router = useRouter();

  const currentUserToken = verifiedUser();
  const { data: singleUser } = useGetSingleUserQuery(currentUserToken?.userId);
  const singleUserData = singleUser?.data;

  useEffect(() => {
    if (!currentUser) return;

    const connectAndJoin = () => {
      if (!socket.connected) {
        socket.connect();
      }

      socket.emit("join", currentUser);

      socket.on("unread_messages", (data) => {
        // console.log('[SOCKET] unread_messages:', data); // debug log
        setNotifications(data);
      });
    };

    connectAndJoin();

    socket.onAny((event, ...args) => {
      // console.log('[Socket Event]', event, args);
    });

    return () => {
      socket.off("unread_messages");
    };
  }, [currentUser]);

  const unreadCount = Object.values(notifications).reduce((a, b) => a + b, 0);

  const handleBadgeClick = () => {
    if (
      singleUserData?.profileStatus &&
      singleUserData.profileStatus !== "safe"
    ) {
      localStorage.removeItem("accessToken");
      document.cookie =
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      router.push("/auth/login");
      return;
    }
    router.push("/dashboard/messages");
  };

  return (
    <div className="relative cursor-pointer" onClick={handleBadgeClick}>
      <div className="relative">
        <FaRegCommentDots className="text-[20px] md:text-[26px] text-[#00BBA7]" />{" "}
        {/* Message Icon */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 md:w-5 md:h-5 text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>
    </div>
  );
};

export default NotificationBadge;
