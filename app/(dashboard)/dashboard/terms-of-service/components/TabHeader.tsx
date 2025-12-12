"use client";

import React from "react";
import { TabType } from "../types";
import TabButton from "./TabButton";

interface TabHeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabHeader({ activeTab, onTabChange }: TabHeaderProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4 border-b pb-4 mb-6">
      <div className="flex items-center text-nowrap space-x-4">
        <TabButton
          isActive={activeTab === "terms"}
          onClick={() => onTabChange("terms")}
          label="Terms and Conditions"
        />
        <TabButton
          isActive={activeTab === "privacy"}
          onClick={() => onTabChange("privacy")}
          label="Privacy Policy"
        />
      </div>
    </div>
  );
}
