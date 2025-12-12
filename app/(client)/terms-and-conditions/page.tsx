"use client";

import React, { useMemo, useState } from "react";
import { useGetTermsQuery } from "@/src/redux/features/termsAndPrivacy/termsApi";
import { useGetPrivacyQuery } from "@/src/redux/features/termsAndPrivacy/privacyApi";

type TabType = "terms" | "privacy";

export default function TermsAndConditions() {
  const [activeTab, setActiveTab] = useState<TabType>("terms");
  const { data: termsData, isLoading: isLoadingTerms } =
    useGetTermsQuery(undefined);
  const { data: privacyData, isLoading: isLoadingPrivacy } =
    useGetPrivacyQuery(undefined);

  const isLoading = isLoadingTerms || isLoadingPrivacy;

  const sortedTermsData = useMemo(() => {
    return [...(termsData?.data || [])].sort((a, b) => {
      const timestampA = parseInt(a._id.substring(0, 8), 16) * 1000;
      const timestampB = parseInt(b._id.substring(0, 8), 16) * 1000;
      return timestampA - timestampB;
    });
  }, [termsData]);

  const sortedPrivacyData = useMemo(() => {
    return [...(privacyData?.data || [])].sort((a, b) => {
      const timestampA = parseInt(a._id.substring(0, 8), 16) * 1000;
      const timestampB = parseInt(b._id.substring(0, 8), 16) * 1000;
      return timestampA - timestampB;
    });
  }, [privacyData]);

  const getLatestUpdateDate = (data: any[]) => {
    if (!data?.length) return "N/A";
    const timestamp = parseInt(data[0]._id.substring(0, 8), 16) * 1000;
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <main className="bg-white text-[#1D1F2C] py-16 px-4 md:px-8 max-w-[1320px] mx-auto">
      {/* Header Section */}
      <div className="py-20 bg-[#F9F9F9]">
        <h1 className="text-center text-3xl font-semibold mb-2">
          {activeTab === "terms" ? "Terms and Conditions" : "Privacy Policy"}
        </h1>
        <div className="text-center text-xs flex justify-center items-center gap-10 text-gray-500 mb-6">
          <span>
            Last Updated:{" "}
            {activeTab === "terms"
              ? getLatestUpdateDate(sortedTermsData)
              : getLatestUpdateDate(sortedPrivacyData)}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex justify-center space-x-4 text-sm">
          <button
            onClick={() => setActiveTab("terms")}
            className={`pb-2 ${
              activeTab === "terms"
                ? "font-semibold border-b-2 border-black cursor-pointer"
                : "text-gray-400 cursor-pointer"
            }`}
          >
            Terms and Conditions
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`pb-2 ${
              activeTab === "privacy"
                ? "font-semibold border-b-2 border-black cursor-pointer"
                : "text-gray-400 cursor-pointer"
            }`}
          >
            Privacy Policy
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20B894]" />
        </div>
      )}

      {/* Content Section */}
      {!isLoading && (
        <div className="space-y-8">
          {activeTab === "terms"
            ? sortedTermsData?.map((section) => (
                <div
                  key={section._id}
                  className="border border-[#E8E8E9] rounded-lg p-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">{section.title}</h3>
                    <span className="text-xs text-gray-500">
                      Updated:{" "}
                      {new Date(section.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div
                    className="prose max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              ))
            : sortedPrivacyData?.map((section) => (
                <div
                  key={section._id}
                  className="border border-[#E8E8E9] rounded-lg p-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">{section.title}</h3>
                    <span className="text-xs text-gray-500">
                      Updated:{" "}
                      {new Date(section.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div
                    className="prose max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              ))}
        </div>
      )}
    </main>
  );
}
