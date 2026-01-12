import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StarRating } from "./StarRating";
import { reviewsApi } from "@/services/reviewsApi";
import { useToast } from "@/hooks/use-toast";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().max(500, "Comment must be less than 500 characters").optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  serviceName: string;
  onSuccess?: () => void;
  mandatory?: boolean;
}

export const ReviewForm = ({
  open,
  onOpenChange,
  bookingId,
  serviceName,
  onSuccess,
  mandatory = false,
}: ReviewFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    // If mandatory and trying to close without submitting, prevent it
    if (mandatory && !newOpen && open) {
      toast({
        title: "Review Required",
        description: "Please submit your review before continuing.",
        variant: "destructive",
      });
      return;
    }
    onOpenChange(newOpen);
  };

  const onSubmit = async (values: ReviewFormValues) => {
    setIsSubmitting(true);
    try {
      await reviewsApi.addReview({
        bookingId,
        rating: values.rating,
        comment: values.comment,
      });

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });

      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Failed to submit review",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-md"
        onPointerDownOutside={(e) => mandatory && e.preventDefault()}
        onEscapeKeyDown={(e) => mandatory && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Rate Your Experience</DialogTitle>
          <DialogDescription>
            How was your experience with {serviceName}?
          </DialogDescription>
        </DialogHeader>

        {mandatory && (
          <Alert variant="default" className="border-primary/50 bg-primary/5">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              Your feedback is required to help us improve our services.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel className="sr-only">Rating</FormLabel>
                  <FormControl>
                    <StarRating
                      rating={field.value}
                      size="lg"
                      interactive
                      onRatingChange={field.onChange}
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    {field.value === 0 && "Select a rating"}
                    {field.value === 1 && "Poor"}
                    {field.value === 2 && "Fair"}
                    {field.value === 3 && "Good"}
                    {field.value === 4 && "Very Good"}
                    {field.value === 5 && "Excellent"}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your experience..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between">
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      {field.value?.length || 0}/500
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-3 justify-end">
              {!mandatory && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting} className={mandatory ? "w-full" : ""}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Review
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
