import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ReportProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export default function ReportProfileModal({
  isOpen,
  onClose,
  userName,
}: ReportProfileModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [otherReason, setOtherReason] = useState("");

  if (!isOpen) return null;

  const reportOptions = [
    "Harassment / Abuse",
    "Inappropriate Content",
    "Spam / Scam",
    "Fraudulent Behavior",
    "Other",
  ];

  const isReportEnabled =
    selectedOption &&
    (selectedOption !== "Other" || otherReason.trim().length > 0);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-[400px] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Report Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          We're sorry to hear that something's wrong. Please select a problem to
          continue.
        </p>

        <div className="space-y-2">
          {reportOptions.map((option) => (
            <div
              key={option}
              className={`p-2 border rounded-md cursor-pointer flex items-center ${
                selectedOption === option
                  ? "bg-red-50 border-red-500"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => {
                setSelectedOption(option);
                if (option !== "Other") {
                  setOtherReason("");
                }
              }}
            >
              <span className="text-sm">{option}</span>
            </div>
          ))}
        </div>

        {selectedOption === "Other" && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              Describe your other issues
            </p>
            <textarea
              className="w-full h-24 p-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
              placeholder="Please describe the issue..."
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
            />
          </div>
        )}

        <div className="flex gap-2 mt-6">
          <Button
            className="flex-1 bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={() => {
              // Handle report submission
              // console.log('Reporting for:', selectedOption, otherReason);
              onClose();
            }}
            disabled={!isReportEnabled}
          >
            Report
          </Button>
          <Button
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
