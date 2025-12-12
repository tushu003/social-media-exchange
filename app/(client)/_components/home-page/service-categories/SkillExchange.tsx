import { useGetSingleUserQuery } from "@/src/redux/features/users/userApi";
import { verifiedUser } from "@/src/utils/token-varify";
import Image from "next/image";

interface SkillExchangeProps {
  selectedService: any;
  selectedSkill: string;
  onSkillChange: (skill: string) => void;
  users: any[];
}

export default function SkillExchange({
  selectedService,
  selectedSkill,
  onSkillChange,
  users,
}: SkillExchangeProps) {
  const validUser = verifiedUser();
  const { data: singleUser } = useGetSingleUserQuery(validUser?.userId);
  const singleUserData = singleUser?.data;
  // console.log("singleUserData", singleUserData);

  return (
    <div className="flex flex-col gap-4 mt-4 sm:mt-6 lg:mt-10 mb-4 sm:mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* My Skill Section */}
        <div className="w-full bg-[#F5F5F5] p-3 sm:p-4 rounded-xl">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">My skill:</p>
          <select
            value={selectedSkill}
            onChange={(e) => onSkillChange(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#20B894]"
          >
            {singleUserData?.my_service?.map((user) => (
              <option key={user._id} value={user._id}>
                {user}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Icon - Shows differently on mobile and desktop */}
        <div className="flex items-center justify-center lg:mx-4">
          <Image
            src="/swapicon.png"
            alt="Swap Icon"
            width={60}
            height={60}
            className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rotate-90 lg:rotate-0"
          />
        </div>

        {/* Request Skill Section */}
        <div className="w-full bg-[#F5F5F5] p-3 sm:p-4 rounded-xl">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">
            Request skill:
          </p>
          <p className="font-medium text-sm sm:text-base">
            {selectedService?.subCategory || "No skill specified"}
          </p>
        </div>
      </div>
    </div>
  );
}
