import React, { useState } from "react";
import { X } from "lucide-react";

interface ReportProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, file: File | null) => void; 
  isLoading: boolean;
}

const ReportProfileModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: ReportProfileModalProps) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const reasons = [
    "Harassment / Abuse",
    "Inappropriate Content",
    "Spam / Scam",
    "Fraudulent Behavior",
    "Other",
  ];

  const handleSubmit = () => {
    if (!selectedReason) {
      setError("You can report the profile after selecting a problem.");
      return;
    }
    
    // If "Other" is selected but no description provided
    if (selectedReason === "Other" && !description.trim()) {
      setError("Please describe the issue");
      return;
    }

    // Pass the actual report type
    const reportType = selectedReason === "Other" ? description : selectedReason;
    onSubmit(reportType, file);  
    
    // Reset states
    setSelectedReason("");
    setDescription("");
    setFile(null);
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 px-10 md:px-0">
      <div className="bg-white rounded-xl p-6 w-[480px] relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-2">Report Profile</h2>
        <p className="text-gray-600 text-sm mb-4">
          We're sorry to hear that something's wrong. Please select a problem to
          continue.
        </p>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm mb-4">
            <span>⚠</span>
            <p>{error}</p>
            <button onClick={() => setError("")} className="ml-auto">
              ×
            </button>
          </div>
        )}

        <div className="space-y-2 mb-4">
          {reasons.map((reason) => (
            <button
              key={reason}
              onClick={() => setSelectedReason(reason)}
              className={`w-full p-3 text-left rounded-lg border ${
                selectedReason === reason
                  ? "border-[#20B894] text-[#20B894]"
                  : "border-gray-200 text-gray-700"
              } hover:border-[#20B894] transition-colors`}
            >
              {reason}
            </button>
          ))}
        </div>

        {selectedReason === "Other" && (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your other issues"
            className="w-full p-3 border border-gray-200 rounded-lg mb-4 min-h-[100px]"
          />
        )}

        <div className="mb-4">
          <p className="text-sm font-medium mb-2">
            Upload supporting file (optional)
          </p>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept="image/*, .pdf"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#20B894] file:text-white hover:file:bg-emerald-700"
          />
          <p className="text-xs text-gray-400 mt-1">
            Accepted formats: PDF, JPG, PNG
            <span className="ml-4">Maximum file size: 50 MB</span>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-[#FE5050] text-white py-2.5 rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
          >
            {isLoading ? "Reporting..." : "Report"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportProfileModal;
