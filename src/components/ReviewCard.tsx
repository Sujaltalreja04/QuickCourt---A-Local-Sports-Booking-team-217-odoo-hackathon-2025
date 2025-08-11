import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '../types';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-gray-900">{review.userName}</p>
          <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              size={16}
              className={idx < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-700 mt-3">{review.comment}</p>
    </div>
  );
};




