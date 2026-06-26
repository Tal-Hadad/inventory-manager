import { Star } from "lucide-react";

type RatingProps = {
  rating?: number;
};

const Rating = ({ rating = 0 }: RatingProps) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((index) => {
        const isFull = rating >= index;
        const isHalf = rating >= index - 0.5 && rating < index;

        return (
          <div key={index} className="relative h-4 w-4">
            <Star className="absolute inset-0 h-4 w-4 text-[#E4E5E9]" />

            {(isFull || isHalf) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: isFull ? "100%" : "50%" }}
              >
                <Star className="h-4 w-4 fill-[#FFC107] text-[#FFC107]" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Rating;
