import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number;
}

export function StarRating({ rating, size = 16 }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <div key={star} className="relative" style={{ width: size, height: size }}>
            <Star
              size={size}
              className="text-gray-200"
              fill="currentColor"
              strokeWidth={0}
            />
            {(filled || half) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: half ? "50%" : "100%" }}
              >
                <Star
                  size={size}
                  className="text-amber-400"
                  fill="currentColor"
                  strokeWidth={0}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
