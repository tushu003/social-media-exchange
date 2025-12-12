"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Bell,
  X,
  MessageSquare,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetAcceptedExchangeNotificationQuery,
  useGetReadExchangeNotificaionQuery,
  usePostMarkAllReadExchangeNotificationMutation,
} from "@/src/redux/features/notification/notificationApi";
import { verifiedUser } from "@/src/utils/token-varify";
import { useGetSingleUserQuery } from "@/src/redux/features/users/userApi";
import { CustomToast } from "@/lib/Toast/CustomToast";
import { useExchangeChatRequestMutation } from "@/src/redux/features/shared/exchangeApi";
import Image from "next/image";

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  notificationCount: number;
  requestList: any;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  isOpen,
  onClose,
  notificationCount,
  requestList,
}) => {
  const [notifications, setNotifications] = useState([]);
  const [localNotifications, setLocalNotifications] = useState([]);
  const popupRef = useRef<HTMLDivElement>(null);
  const validUser = verifiedUser();
  const { data: singleUser } = useGetSingleUserQuery(validUser?.userId);
  const singleUserData = singleUser?.data;
  // console.log("requestList popup", requestList);

  const { data: getReadExchangeNotificaion, isLoading: isNotificationLoading } =
    useGetReadExchangeNotificaionQuery(singleUserData?._id, {
      skip: !singleUserData?._id,
      pollingInterval: 5000,
    });
  // console.log("getReadExchangeNotificaion", getReadExchangeNotificaion?.data);

  // Update notifications when API data changes
  useEffect(() => {
    if (getReadExchangeNotificaion?.data && localNotifications.length === 0) {
      setNotifications(getReadExchangeNotificaion.data);
      setLocalNotifications(getReadExchangeNotificaion.data);
    }
  }, [getReadExchangeNotificaion, localNotifications.length]);

  // console.log("localNotification", localNotifications);

  const [postMarkAllReadExchangeNotification, { isLoading: isMarkingAllRead }] =
    usePostMarkAllReadExchangeNotificationMutation();

  const { data: getAcceptedExchangeNotification } =
    useGetAcceptedExchangeNotificationQuery(singleUserData?._id, {
      skip: !singleUserData?._id,
      pollingInterval: 5000,
    });
  // console.log(
  //   "getAcceptedExchangeNotification",
  //   getAcceptedExchangeNotification?.data
  // );

  const [exchangeChatRequest, { isLoading: isExchangeLoading }] =
    useExchangeChatRequestMutation();

  // Normalize and merge notifications
  const mergedNotifications = useMemo(() => {
    const acceptedNotifications = (
      getAcceptedExchangeNotification?.data || []
    ).map((notification) => ({
      ...notification,
      _source: "notification",
      // Keep existing data structure
    }));

    const requestNotifications = (requestList?.data || []).map((request) => ({
      ...request,
      _source: "request",
      isAcceptNotificationRead: false, // Requests are always unread
      // Keep nested user objects intact
    }));

    return [...acceptedNotifications, ...requestNotifications].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [getAcceptedExchangeNotification?.data, requestList?.data]);

  // console.log("marged Notification", mergedNotifications);

  const handleRequest = async (notification, isAccepted) => {
    try {
      const data = {
        senderId: notification.senderUserId._id,
        receiverId: notification.reciverUserId._id,
        isAccepted,
      };
      await exchangeChatRequest(data).unwrap();
      CustomToast.show(
        `Request ${isAccepted ? "accepted" : "declined"} successfully`
      );
    } catch (error) {
      console.error("Error handling request:", error);
      CustomToast.show("Failed to process request. Please try again.");
    }
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close popup on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const markAsRead = (id: string | number) => {
   
    setLocalNotifications((prev) => {
      const updated = prev.map((notification) =>
        notification._id === id || notification.id === id
          ? { ...notification, isAcceptNotificationRead: true }
          : notification
      );
      
      return updated;
    });
  };

  const markAllAsRead = async () => {
    try {
      if (singleUserData?._id) {
        
        const result = await postMarkAllReadExchangeNotification(
          singleUserData._id
        ).unwrap();
        // console.log("API response:", result);

        // Update local state to mark all notifications as read (but keep them visible)
        setLocalNotifications((prev) => {
          const updated = prev.map((notification) => ({
            ...notification,
            isAcceptNotificationRead: true,
          }));
          // console.log("After updating local state - count:", updated.length);
          return updated;
        });

        // Show success toast
        CustomToast.show("All notifications marked as read");
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      // Show error toast
      CustomToast.show(
        "Failed to mark notifications as read. Please try again."
      );
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case "request":
        return <User className="w-4 h-4 text-green-500" />;
      case "review":
        return <CheckCircle className="w-4 h-4 text-yellow-500" />;
      case "system":
        return <AlertCircle className="w-4 h-4 text-purple-500" />;
      case "exchange":
        return <User className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case "message":
        return "bg-blue-100 text-blue-800";
      case "request":
        return "bg-green-100 text-green-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      case "system":
        return "bg-purple-100 text-purple-800";
      case "exchange":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const unreadCount = localNotifications.filter(
    (n) => !n.isAcceptNotificationRead
  ).length;


  function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  if (!isOpen) return null;

  // ================= Show Message Notification =================
  // const [exchangeChatRequest, isLoading] = useExchangeChatRequestMutation();

  const requestHandler = async (isAccepted, exchangeId) => {
    const data = {
      exchangeId,
      isAccepted,
      reciverUserId: validUser?.userId,
    };
    const result = await exchangeChatRequest(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16">
      <div className="fixed inset-0  bg-opacity-25" onClick={onClose} />
      <div
        ref={popupRef}
        className="relative bg-white rounded-lg shadow-xl border border-gray-200 w-96 max-h-[650px] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          {/* Left: Icon, Title, Unread badge */}
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Notifications</h3>
           
          </div>
          {/* Right: Mark all as read, Close */}
          <div className="flex items-center space-x-2">
            
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              disabled={isMarkingAllRead}
              className="text-xs text-blue-500 hover:text-blue-700 disabled:opacity-50 cursor-pointer"
              aria-label="Mark all as read"
            >
              Mark all read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded-full"
              aria-label="Close notifications"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[500px] overflow-y-auto">
          {isNotificationLoading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p>Loading notifications...</p>
            </div>
          ) : mergedNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No notifications yet</p>
              <p className="text-sm">
                You'll see exchange requests and notifications here when you
                receive them.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {mergedNotifications.map((notification, index) => {
                const isRequest = notification._source === "request";
                const isUnread = !notification.isAcceptNotificationRead;

                // Handle user data based on notification type
                const userData = isRequest
                  ? notification.senderUserId
                  : {
                      email: notification.selectedEmail,
                      first_name: notification.selectedEmail
                    };

                return (
                  <div
                    key={notification._id}
                    className={`flex items-start px-4 py-3 rounded-lg mb-2 shadow-sm bg-white relative ${
                      isUnread
                        ? "border-l-4 border-green-500"
                        : "border-l-4 border-transparent"
                    }`}
                    onClick={() => !isRequest && markAsRead(notification._id)}
                  >
                    {/* Avatar/Initial */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold mr-3 flex-shrink-0">
                     
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${notification?.isAccepted === "true" ? notification?.reciverImage : notification?.senderImage}`}
                        alt={notification?.senderUserId?.first_name
                          ?.slice(0, 2)
                          .toUpperCase()}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {userData.first_name || userData.email}
                        </span>
                        <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>

                      {/* Message */}
                      <div
                        className={`text-sm line-clamp-2 ${
                          isRequest ? "text-green-700" : "text-gray-600"
                        }`}
                      >
                        {isRequest
                          ? `Sent you a request for "${notification.senderService}"`
                          : notification.isAccepted === "true"
                          ? `Your service "${notification.senderService}" was accepted!`
                          : `You have a new service request for "${notification.senderService}".`}
                      </div>

                      {/* Action Buttons - Only for requests */}
                      {isRequest && (
                        <div className="mt-2 flex gap-2">
                          <button
                            // onClick={() => handleRequest(notification, true)}
                            onClick={() =>
                              requestHandler("true", notification._id)
                            }
                            disabled={isExchangeLoading}
                            className="px-4 py-1.5 bg-green-500 text-white rounded-md text-xs font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
                          >
                            Accept
                          </button>
                          <button
                            // onClick={() => handleRequest(notification, false)}

                            onClick={() =>
                              requestHandler("false", notification._id)
                            }
                            disabled={isExchangeLoading}
                            className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-md text-xs font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Status Dot */}
                    {isUnread && (
                      <span className="ml-3 mt-1 w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

       
      </div>
    </div>
  );
};

export default NotificationPopup;
