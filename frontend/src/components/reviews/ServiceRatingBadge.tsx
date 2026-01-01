import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { reviewsApi } from "@/services/reviewsApi";
import { cn } from "@/lib/utils";

interface ServiceRatingBadgeProps {
  serviceId: string;
  className?: string;
  showLabel?: boolean;
  showReviewCount?: boolean;
}

export const ServiceRatingBadge = ({
  serviceId,
  className,
  showLabel = true,
  showReviewCount = false,
}: ServiceRatingBadgeProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ratingData, reviews] = await Promise.all([
          reviewsApi.getServiceRating(serviceId),
          showReviewCount ? reviewsApi.getServiceReviews(serviceId) : Promise.resolve([]),
        ]);
        setRating(Number(ratingData.averageRating));
        setReviewCount(reviews.length);
      } catch {
        // Silently fail - don't show rating if fetch fails
      }
    };

    fetchData();
  }, [serviceId, showReviewCount]);

  if (rating === null || rating === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span className="font-medium">{rating.toFixed(1)}</span>
      {showReviewCount && reviewCount > 0 && (
        <span className="text-muted-foreground text-sm">({reviewCount})</span>
      )}
      {showLabel && !showReviewCount && (
        <span className="text-muted-foreground text-sm">rating</span>
      )}
    </div>
  );
};
