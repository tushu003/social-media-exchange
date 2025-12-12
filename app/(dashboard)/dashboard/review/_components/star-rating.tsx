import { Star } from "lucide-react";

export function StarRating({ rating }: { rating: number }) {
    const rounded = Math.round(rating);
    return (
      <div className="flex">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={14}
            fill={i < rounded ? "#FBBF24" : "none"}
            stroke="#FBBF24"
          />
        ))}
      </div>
    );
  }