'use client';

import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    desktopNotification: true,
    unreadBadge: true,
    communicationEmails: true,
    announcements: false,
    disableSound: false,
  });

  return (
    <div>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Notification Setting</h2>

        {/* Desktop Notifications */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base text-[#1D1F2C] font-medium">Enable Desktop Notification</h3>
              <p className="text-sm font-normal text-[#777980]">
                Receive notification all of the messages, contracts, documents.
              </p>
            </div>
            <Switch
              checked={settings.desktopNotification}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, desktopNotification: checked }))
              }
              className="data-[state=checked]:bg-[#20B894]"
            />
          </div>

          {/* Unread Badge */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[#1D1F2C] font-medium text-base">Enable Unread Notification Badge</h3>
              <p className="text-sm font-normal text-[#777980]">
                Receive notification all of the messages, contracts, documents.
              </p>
            </div>
            <Switch
              checked={settings.unreadBadge}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, unreadBadge: checked }))
              }
              className="data-[state=checked]:bg-[#20B894]"
            />
          </div>

          {/* Push Notification Timeout */}
          <div className="space-y-2">
            <h3 className="text-base text-[#1D1F2C] font-medium">Push Notification Time-out</h3>
            <Select defaultValue="10">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select timeout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Minutes</SelectItem>
                <SelectItem value="10">10 Minutes</SelectItem>
                <SelectItem value="15">15 Minutes</SelectItem>
                <SelectItem value="30">30 Minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Email Notifications Section */}
          <div className="pt-6 border-t">
            <h3 className="text-[22px] font-medium mb-4 text-[#1D1F2C]">Email Notifications</h3>

            {/* Communication Emails */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base text-[#1D1F2C] font-medium">Communication Emails</h4>
                <p className="text-sm text-gray-500">
                  Receive email for messages, contracts, documents
                </p>
              </div>
              <Switch
                checked={settings.communicationEmails}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, communicationEmails: checked }))
                }
                className="data-[state=checked]:bg-[#20B894]"
              />
            </div>

            {/* Announcements */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base text-[#1D1F2C] font-medium">Announcements & Updates</h4>
                <p className="text-sm text-gray-500">
                  Receive email about product updates, improvements, etc.
                </p>
              </div>
              <Switch
                checked={settings.announcements}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, announcements: checked }))
                }
                className="data-[state=checked]:bg-[#20B894]"
              />
            </div>
          </div>

          {/* Sounds Section */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Sounds</h3>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Disable All Notification Sounds</h4>
                <p className="text-sm text-gray-500">
                  Mute all notification of the messages, contracts, documents.
                </p>
              </div>
              <Switch
                checked={settings.disableSound}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, disableSound: checked }))
                }
                className="data-[state=checked]:bg-[#20B894]"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}