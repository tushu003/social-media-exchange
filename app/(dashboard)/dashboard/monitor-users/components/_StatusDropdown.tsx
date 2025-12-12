import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface StatusDropdownProps {
  status: string;
  convId: string;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onStatusChange: (status: string) => void;
}

const statusColor = {
  Completed: "text-green-600 bg-green-100",
  "Reported: pending": "text-yellow-600 bg-yellow-100",
  Reported: "text-red-600 bg-red-100",
};

export function StatusDropdown({ status, convId, open, onOpenChange, onStatusChange }: StatusDropdownProps) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer hover:opacity-80 ${
            statusColor[status as keyof typeof statusColor] || ""
          }`}
        >
          {status.includes("Reported") ? status : `✓ ${status}`}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px] p-2">
        <div className="space-y-2">
          {["Completed", "Reported: pending", "Reported"].map((statusOption) => (
            <div
              key={statusOption}
              onClick={() => onStatusChange(statusOption)}
              className={`flex items-center px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-100 ${
                status === statusOption ? "bg-gray-50" : ""
              }`}
            >
              <div className={`w-2 h-2 rounded-full mr-2 ${
                statusOption === "Completed" ? "bg-green-500" : 
                statusOption === "Reported: pending" ? "bg-yellow-500" : "bg-red-500"
              }`} />
              {statusOption}
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}