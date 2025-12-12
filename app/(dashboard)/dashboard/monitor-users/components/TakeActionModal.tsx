import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

interface TakeActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: {
    id: string;
    user1: string;
    user2: string;
    status: string;
    joinDate: string;
    reportDetails?: {
      reportBy: {
        name: string;
        email: string;
      };
      reportAgainst: {
        name: string;
        email: string;
      };
      reason: string;
      date: string;
    };
  };
}

export function TakeActionModal({ isOpen, onClose, conversation }: TakeActionModalProps) {
  const [selectedAction, setSelectedAction] = useState("");
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: ""
  });
  // console.log("conversation", conversation);
  

  const handleSubmit = () => {
    if (selectedAction === "suspend") {
      setConfirmationModal({
        isOpen: true,
        title: "Suspend Account",
        message: "Are you sure you want to suspend the account of this user?"
      });
    } else if (selectedAction === "block") {
      setConfirmationModal({
        isOpen: true,
        title: "Block User",
        message: "Are you sure you want to block this user?"
      });
    }
  };

  const handleConfirm = () => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white rounded-xl w-[400px] p-6" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Review reported reason</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-gray-500">Report By:</span>
                <div className="text-right">
                  <p>{conversation.reportDetails?.reportBy.name || conversation.user1}</p>
                  <p className="text-sm text-gray-500">
                    {conversation.reportDetails?.reportBy.email || 
                      `${conversation.user1.toLowerCase().replace(/\s+/g, '-')}@gmail.com`}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Report Reason:</span>
                <span className="text-red-500">
                  {conversation.reportDetails?.reason || "Fraudulent Behavior"}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-500">Report Against:</span>
                <div className="text-right">
                  <p>{conversation.reportDetails?.reportAgainst.name || conversation.user2}</p>
                  <p className="text-sm text-gray-500">
                    {conversation.reportDetails?.reportAgainst.email || 
                      `${conversation.user2.toLowerCase().replace(/\s+/g, '-')}@gmail.com`}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Date:</span>
                <span>{conversation.reportDetails?.date || conversation.joinDate}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Take Action</h3>
              <RadioGroup 
                value={selectedAction} 
                onValueChange={setSelectedAction}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="safe" id="safe" />
                  <Label htmlFor="safe">Mark as safe</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="suspend" id="suspend" />
                  <Label htmlFor="suspend">Suspend Account</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="block" id="block" />
                  <Label htmlFor="block">Block & Remove Profile</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleSubmit}
                disabled={!selectedAction || selectedAction === "safe"}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
      />
    </>
  );
}