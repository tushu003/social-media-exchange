'use client';

import React from 'react';
import Image from 'next/image';
import profile from "@/public/avatars/emily.png";

export default function NotificationsPage() {
  const notifications = [
    { id: 1, type: 'message', text: "Chris Glasser sent you a message.", image: profile },
    { id: 2, type: 'alert', text: "Account Suspension Notice: 2 weeks suspension.", image: null },
    { id: 3, type: 'message', text: "John Doe liked your post.", image: profile },
    { id: 4, type: 'alert', text: "Server maintenance scheduled for tomorrow.", image: null },
    { id: 5, type: 'message', text: "Alice commented on your post.", image: profile },
    { id: 6, type: 'message', text: "Your password was changed successfully.", image: null },
  ];

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-xl font-semibold mb-6">All Notifications</h2>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50">
            {notification.image ? (
              <Image src={notification.image} alt="User" width={40} height={40} className="rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-medium">
                {notification.text.split(' ')[0].slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm text-gray-600">{notification.text}</p>
              <span className="text-xs text-gray-400 mt-1 block">2 hours ago</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}