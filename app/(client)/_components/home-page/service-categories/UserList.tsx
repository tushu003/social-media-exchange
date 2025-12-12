import { verifiedUser } from "@/src/utils/token-varify";
import Image from "next/image";

interface UserListProps {
  users: any[];
  selectedUsers: string[];
  onUserToggle: (userId: string) => void;
  isLoading?: boolean;
}

export default function UserList({
  users,
  selectedUsers,
  onUserToggle,
  isLoading,
}: UserListProps) {
  const validUser = verifiedUser();

  // Filter out the current user
  const filteredUsers = users.filter((user) => user._id !== validUser?.userId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20B894]"></div>
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No users found for this category
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3 max-h-[300px] sm:max-h-[420px] overflow-y-auto mb-4 sm:mb-6 bg-[#EDE3D9] p-2 sm:p-4 rounded-xl">
      {/* Search Input */}

      {/* User List */}
      {filteredUsers?.map((user) => (
        <div
          key={user._id}
          onClick={() => onUserToggle(user._id)}
          className={`flex justify-between items-center bg-white p-2 sm:p-3 border rounded-xl ${
            selectedUsers.includes(user._id)
              ? "border-[#20B894] bg-[#F8FFFD]"
              : "border-gray-200"
          } cursor-pointer hover:bg-gray-50 transition-colors duration-200`}
        >
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
              {user?.profileImage ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${user?.profileImage}`}
                  alt={user?.first_name || "User"}
                  fill
                  className="object-cover"
                  onError={(e: any) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement.innerHTML = `
                      <div class="w-full h-full bg-[#20B894] flex items-center justify-center text-white text-xs sm:text-sm font-medium">
                        ${user?.first_name?.slice(0, 2)?.toUpperCase() || "UN"}
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-[#20B894] flex items-center justify-center text-white text-xs sm:text-sm font-medium">
                  {user.first_name?.slice(0, 2)?.toUpperCase() || "UN"}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm sm:text-base text-[#070707] truncate pr-2">
                {user?.first_name || "Unknown"}{" "}
                <span className="text-yellow-500 ml-1 text-xs sm:text-sm">
                  ★ {user?.rating || "0.0"}
                </span>
              </p>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                {user?.email || "No email"}
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={selectedUsers.includes(user._id)}
            onChange={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 sm:w-5 sm:h-5 accent-[#20B894] pointer-events-none ml-2 sm:ml-4"
          />
        </div>
      ))}
    </div>
  );
}
