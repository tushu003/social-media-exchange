import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface CategoryCardProps {
  category: any;
  onExchangeClick: (category: any) => void;
}

export default function CategoryCard({
  category,
  onExchangeClick,
}: CategoryCardProps) {
  return (
    <div className="border border-[#20B894] rounded-2xl p-6 text-center hover:bg-[#F1FCF9] hover:text-[#070707] transition">
      <div className="relative w-28 h-28 mx-auto mb-4 border rounded-full overflow-hidden">
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${category?.categoryImage}`}
          alt={category?.categoryImage}
          fill
          className="object-cover p-2 rounded-full"
          onError={(e: any) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement.innerHTML = `
              <div class="w-full h-full rounded-full bg-[#20B894] flex items-center justify-center text-white text-sm font-medium">
                Category
              </div>
            `;
          }}
        />
      </div>
      <h3 className="font-medium text-lg mb-4">{category?.subCategory}</h3>
      <div className="flex justify-center items-center">
        <button
          onClick={() => onExchangeClick(category)}
          className="flex items-center justify-center gap-2 text-sm border border-[#20B894] text-[#20B894] px-4 py-2 rounded-full hover:bg-[#20B894]/10 transition cursor-pointer"
        >
          Exchange Service <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
