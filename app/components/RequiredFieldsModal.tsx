"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface RequiredFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
  missingFields: {
    firstName?: boolean;
    lastName?: boolean;
    displayName?: boolean;
    phoneNumber?: boolean;
    dateOfBirth?: boolean;
    gender?: boolean;
    country?: boolean;
    city?: boolean;
    state?: boolean;
    zipCode?: boolean;
    streetAddress?: boolean;
    aboutMe?: boolean;
  };
}

const fieldLabels = {
  firstName: "First Name",
  lastName: "Last Name",
  displayName: "Display Name",
  phoneNumber: "Phone Number",
  dateOfBirth: "Date of Birth",
  gender: "Gender",
  country: "Country",
  city: "City",
  state: "State / Province / County / Region",
  zipCode: "ZIP Code",
  streetAddress: "Street Address",
  aboutMe: "About Me",
};

export default function RequiredFieldsModal({
  isOpen,
  onClose,
  missingFields,
}: RequiredFieldsModalProps) {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/dashboard/user-profile");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center flex items-center justify-center gap-2">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            Required Fields Missing
          </DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm mb-3">
              Please complete the following required fields to send exchange
              requests:
            </p>
            <div className="space-y-2">
              {Object.entries(missingFields).map(
                ([field, isMissing]) =>
                  isMissing && (
                    <div key={field} className="flex items-center gap-2">
                      <span className="text-red-500 text-xs font-medium">
                        REQUIRED
                      </span>
                      <span className="text-gray-700">
                        {fieldLabels[field as keyof typeof fieldLabels]}
                      </span>
                    </div>
                  )
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={handleRedirect}
              className="bg-[#20B894] hover:bg-[#1a9678] text-white px-6 py-2 cursor-pointer"
            >
              Complete Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
