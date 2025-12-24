import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { reviewsApi } from "@/services/reviewsApi";
import { cn } from "@/lib/utils";

interface ServiceRatingBadgeProps {
  serviceId: string;
  className?: string;
  showLabel?: boolean;
}

export const ServiceRatingBadge = ({
  serviceId,
  className,
  showLabel = true,
}: ServiceRatingBadgeProps) => {
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const data = await reviewsApi.getServiceRating(serviceId);
        setRating(Number(data.averageRating));
      } catch {
        // Silently fail - don't show rating if fetch fails
      }
    };

    fetchRating();
  }, [serviceId]);

  if (rating === null || rating === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span className="font-medium">{rating}</span>
      {showLabel && (
        <span className="text-muted-foreground text-sm">rating</span>
      )}
    </div>
  );
};
