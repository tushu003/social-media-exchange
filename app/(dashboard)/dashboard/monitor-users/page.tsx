"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { ArrowRightLeft, ChevronDown } from "lucide-react";
import { PendingIcon } from "../../../../icons/PendingIcon";
import { MessageIcon } from "../../../../icons/MessageIcon";
import { ConfirmedIcon } from "../../../../icons/ConfirmedIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatCard } from "./components/StatCard";
import { ConversationTable } from "./components/ConversationTable";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import { useGetAllExchangeQuery } from "@/src/redux/features/admin/exchangeApi";
import {
  useGetProfileReportQuery,
  useGetSuspendedDataQuery,
} from "@/src/redux/features/admin/profileReportApi";
import { BanIcon } from "lucide-react";

interface ExchangeUser {
  _id: string;
  first_name: string;
  email: string;
  personalInfo: {
    display_name: string;
    first_name: string;
    last_name: string;
    phone_number: number;
    gender: string;
    dath_of_birth: string;
  };
}

interface Exchange {
  _id: string;
  senderUserId: ExchangeUser;
  reciverUserId: ExchangeUser;
  email: string;
  senderService: string;
  reciverService: string;
  isAccepted: string;
  reciverUserAccepted: boolean;
  senderUserAccepted: boolean;
  my_service: string[];
  createdAt: string;
  updatedAt: string;
}

export default function MonitorMessaging() {
  const [filter, setFilter] = useState("Completed Exchange");
  const [dateFilter, setDateFilter] = useState("Last 30 days");
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});

  const { data: getAllExchange, refetch: refetchAllExchange } =
    useGetAllExchangeQuery({});
  useEffect(() => {
    refetchAllExchange();
  }, []);
  console.log("getAllExchange", getAllExchange?.data);

  const { data: getProfileReport, refetch: refetchGetProfileReport } =
    useGetProfileReportQuery({});
  useEffect(() => {
    refetchGetProfileReport();
  }, []);
  const transformedConversations =
    getAllExchange?.data?.exchangeData?.map((exchange: Exchange) => ({
      id: exchange._id,
      user1: exchange?.senderUserId?.first_name || "Unknown",
      user2: exchange?.reciverUserId?.first_name || "Unknown",
      joinDate: new Date(exchange.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      status:
        exchange.reciverUserAccepted && exchange.senderUserAccepted
          ? "Completed"
          : "Pending",
      senderService: exchange?.senderService || "No service",
      receiverServices: exchange?.reciverService || [],
      senderEmail: exchange?.senderUserId?.email || "",
      receiverEmail: exchange?.reciverUserId?.email || "",
      senderDetails: exchange?.senderUserId || {},
      receiverDetails: exchange?.reciverUserId || {},
    })) || [];
  // console.log("transformedConversations", transformedConversations);

  const reportedProfile =
    getProfileReport?.data?.map((report) => ({
      id: report._id || "",
      user: report.reportedId?.first_name || "Unknown",
      email: report.reportedId?.email || "",
      reason: report.reportType || "",
      status: report.action || "",
      description: report.description || "",
      createdAt: new Date(report.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      reporterId: report.reporterId || {},
      reportedId: report.reportedId || {},
      supportingFile: report.supportingFile || "",
      reportType: report.reportType || "",
    })) || [];

  console.log("reportedProfile", reportedProfile);

  const { data: getSuspendedData, refetch: refetchGetSuspendedData } =
    useGetSuspendedDataQuery({});
  useEffect(() => {
    refetchGetSuspendedData();
  }, []);
  const suspendData = getSuspendedData?.data;

  // console.log(107, data?.data);

  // Add suspended profiles transformation
  const suspendedProfiles = getSuspendedData?.data;

  const handleStatusChange = (convId: string, status: string) => {
    setOpen({ ...open, [convId]: false });
  };

  const filteredConversations = transformedConversations.filter((conv) => {
    if (filter === "Completed Exchange") {
      return conv.status === "Completed";
    }
    return conv.status === "Pending";
  });
  const updatedStatCards = [
    {
      title: "Total Conversations",
      // value: transformedConversations?.length,
      value: getAllExchange?.data?.acceptedData?.length,
      subtitle: "All conversations",
      icon: MessageIcon,
    },
    {
      title: "Total Exchanges",
      // value: transformedConversations?.length,
      value: getAllExchange?.data?.exchangeData?.length,
      subtitle: "All exchanges",
      icon: ArrowRightLeft,
    },
    {
      title: "Reported Profile",
      value: reportedProfile?.length,
      subtitle: "Awaiting Completion",
      icon: PendingIcon,
    },
    {
      title: "Suspended Profiles",
      value: suspendedProfiles?.length,
      subtitle: "Blocked accounts",
      icon: BanIcon,
    },
  ];

  const displayData = {
    "Completed Exchange": filteredConversations,
    "Reported Profile": reportedProfile,
    "Suspended Profiles": suspendedProfiles,
  }[filter];

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {updatedStatCards.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-semibold">
            {filter === "Completed Exchange"
              ? "Exchange Tracking"
              : filter === "Reported Profile"
              ? "Reported Profiles"
              : "Suspended Profiles"}
          </h2>

          <Tabs defaultValue="Completed Exchange" onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger
                value="Completed Exchange"
                className="cursor-pointer"
              >
                Completed Exchange
              </TabsTrigger>
              <TabsTrigger value="Reported Profile" className="cursor-pointer">
                Reported Profile
              </TabsTrigger>
              <TabsTrigger
                value="Suspended Profiles"
                className="cursor-pointer"
              >
                Suspended Profiles
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
           
          </div>

          {/* Table */}
          <div className="w-full -mx-3 sm:mx-0">
            <ConversationTable
              conversations={displayData}
              isReportedView={filter === "Reported Profile"}
              isSuspendedView={filter === "Suspended Profiles"}
              open={open}
              setOpen={setOpen}
              suspendData={suspendData}
              onStatusChange={handleStatusChange}
              onTakeAction={(conversation) => {
                console.log("Taking action:", conversation);
              }}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
