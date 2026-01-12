import { useEffect, useState } from "react";
import { format } from "date-fns";
import { User, Loader2, Briefcase } from "lucide-react";
import { StarRating } from "./StarRating";
import { reviewsApi, Review } from "@/services/reviewsApi";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ReviewsListProps {
  serviceId: string;
  refreshTrigger?: number;
  showServiceName?: boolean;
}

export const ReviewsList = ({ serviceId, refreshTrigger, showServiceName = false }: ReviewsListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await reviewsApi.getServiceReviews(serviceId);
        setReviews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reviews");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [serviceId, refreshTrigger]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        {error}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No reviews yet. Be the first to review!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const userName = typeof review.user === "object" ? review.user.name : "Anonymous";
        const initials = userName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        
        const serviceName = typeof review.service === "object" ? review.service.title : null;
        const serviceCategory = typeof review.service === "object" ? review.service.category : null;

        return (
          <div
            key={review._id}
            className="p-4 rounded-lg border bg-card"
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {initials || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium truncate">{userName}</p>
                  <time className="text-xs text-muted-foreground shrink-0">
                    {format(new Date(review.createdAt), "MMM d, yyyy")}
                  </time>
                </div>

                {showServiceName && serviceName && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <Briefcase className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground truncate">
                      {serviceName}
                    </span>
                    {serviceCategory && (
                      <Badge variant="secondary" className="text-xs ml-1">
                        {serviceCategory}
                      </Badge>
                    )}
                  </div>
                )}

                <StarRating rating={review.rating} size="sm" className="mt-1" />

                {review.comment && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {review.comment}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
