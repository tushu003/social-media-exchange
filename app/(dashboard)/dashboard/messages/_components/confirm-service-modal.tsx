import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useAcceptExchangeMutation } from "@/src/redux/features/shared/exchangeApi";
import { verifiedUser } from "@/src/utils/token-varify";
import { toast } from "sonner";
import { authApi } from "@/src/redux/features/auth/authApi";

interface ConfirmServiceModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  myServices: string[];
  senderService: string;
  acceptedService: string;
  setIsConfirmExchange: (isConfirmExchange: boolean) => void;
}

export default function ConfirmServiceModal({
  isOpen,
  onClose,
  id,
  myServices = [],
  senderService = "",
  acceptedService = "",
  setIsConfirmExchange,
}: ConfirmServiceModalProps) {
  const [selectedService, setSelectedService] = useState<string>("");
  const [acceptExchange] = useAcceptExchangeMutation();
  const currentUser = verifiedUser();

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirmService = async () => {
    if (!selectedService) {
      toast.error("Please select your service first");
      return;
    }

    try {
      const result = await acceptExchange({
        userId: currentUser?.userId,
        exchangeId: id,
        reciverService: selectedService,
      });

      if (result?.data?.success) {
        toast.success(result?.data?.message);
        setIsConfirmExchange(true);
        onClose();
      } else {
        toast.error("Failed to confirm exchange");
      }
    } catch (error) {
      toast.error("An error occurred while confirming exchange");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Confirm Exchange Service</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Sender's Service */}
          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              The service you are offering for exchange:
            </label>
            <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
              {senderService}
            </div>
          </div>

          {/* Exchange Icon */}
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-[#20B89410] rounded-full flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#20B894"
                strokeWidth="2"
              >
                <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" />
              </svg>
            </div>
          </div>

          {/* Your Service Selection */}
          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              The service the other user is offering for exchange:
            </label>
            <Select onValueChange={setSelectedService} value={selectedService}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a service to offer" />
              </SelectTrigger>
              <SelectContent>
                {myServices.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          className="w-full mt-8 bg-[#20B894] hover:bg-[#1ca883] text-white cursor-pointer"
          onClick={handleConfirmService}
          disabled={!selectedService}
        >
          Confirm Exchange
        </Button>
      </div>
    </div>
  );
}
