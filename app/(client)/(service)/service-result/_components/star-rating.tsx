// src/components/services/StarRating.tsx
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating }) => (
  <div className="flex items-center text-yellow-500">
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-current' : 'stroke-current'}`} 
      />
    ))}
    <span className="ml-2 text-gray-600 text-sm">({rating})</span>
  </div>
);