import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
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
import { StarRating } from "./StarRating";
import { reviewsApi } from "@/services/reviewsApi";
import { useToast } from "@/hooks/use-toast";

const reviewSchema = z.object({
  rating: z.coerce.number().min(1, "Please select a star rating").max(5),
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

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({ rating: 0, comment: "" });
    }
  }, [open, form]);

  const onSubmit = async (values: ReviewFormValues) => {
    if (!bookingId) {
      toast({
        title: "Error",
        description: "Booking ID is missing. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewsApi.addReview({
        bookingId,
        rating: values.rating,
        comment: values.comment || "", // Send empty string if undefined
      });

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
        variant: "default", // Success style
      });

      form.reset();
      onOpenChange(false);
      onSuccess?.(); // Notify parent to hide the button
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to submit review.";

      // --- SMART FIX: Handle 'Already Reviewed' gracefully ---
      if (errorMessage.toLowerCase().includes("already reviewed")) {
        toast({
          title: "Already Reviewed",
          description: "You have already reviewed this service.",
          variant: "default", // Blue/Neutral style instead of Red/Error
        });
        
        // Treat as success so the parent component hides the button
        onOpenChange(false);
        onSuccess?.(); 
        return;
      }
      // -----------------------------------------------------

      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Your Experience</DialogTitle>
          <DialogDescription>
            How was your experience with <span className="font-medium text-foreground">{serviceName}</span>?
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center gap-2">
                  <FormLabel className="sr-only">Rating</FormLabel>
                  <FormControl>
                    <StarRating
                      rating={field.value}
                      size="lg"
                      interactive
                      onRatingChange={(val) => field.onChange(val)}
                    />
                  </FormControl>
                  
                  {/* Visual feedback for rating */}
                  <div className="h-6 text-sm font-medium transition-colors">
                    {field.value === 1 && <span className="text-destructive">Poor 😞</span>}
                    {field.value === 2 && <span className="text-orange-500">Fair 😐</span>}
                    {field.value === 3 && <span className="text-yellow-600">Good 🙂</span>}
                    {field.value === 4 && <span className="text-blue-600">Very Good 😄</span>}
                    {field.value === 5 && <span className="text-green-600">Excellent 🤩</span>}
                    {field.value === 0 && <span className="text-muted-foreground">Tap a star to rate</span>}
                  </div>
                  
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
                      placeholder="Share details about your experience..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <FormMessage />
                    <span>{field.value?.length || 0}/500</span>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-3 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              
              <Button type="submit" disabled={isSubmitting}>
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