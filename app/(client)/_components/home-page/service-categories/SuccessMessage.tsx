import { CheckCircle } from "lucide-react";

export default function SuccessMessage() {
  return (
    <div className="text-center py-10">
      <CheckCircle className="w-12 h-12 mx-auto text-[#20B894] mb-4" />
      <h2 className="text-xl font-semibold text-[#070707] mb-2">
        Exchange request is sent!
      </h2>
      <p className="text-gray-500 max-w-md mx-auto">
        Your exchange request has been sent. The service provider will contact
        you via chat. We wish you all the best!
      </p>
    </div>
  );
}
