import { Star, Loader2, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { reviewsApi, Review } from "@/services/reviewsApi";

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  delay: string;
}

const TestimonialCard = ({
  name,
  role,
  content,
  rating,
  delay,
}: TestimonialCardProps) => {
  return (
    <div
      className={`bg-card p-6 rounded-2xl shadow-card animate-fade-up ${delay} relative overflow-hidden group hover:shadow-lg transition-shadow duration-300`}
    >
      <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />

      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? "fill-accent text-accent"
                : "text-muted"
            }`}
          />
        ))}
      </div>

      <p className="text-foreground mb-6 leading-relaxed line-clamp-4">
        "{content}"
      </p>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-primary font-semibold text-lg">
            {name.charAt(0)}
          </span>
        </div>
        <div>
          <p className="font-semibold text-card-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await reviewsApi.getAllReviews();
        setReviews(res.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-2">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Real feedback from our verified customers.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* No reviews */}
        {!loading && reviews.length === 0 && (
          <p className="text-center text-muted-foreground">
            No reviews available yet.
          </p>
        )}

        {/* Reviews */}
        {!loading && reviews.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.slice(0, 3).map((review, index) => (
                <TestimonialCard
                  key={review._id}
                  name={
                    typeof review.user === "object"
                      ? review.user.name
                      : "Customer"
                  }
                  role="Verified Customer"
                  content={review.comment || "Great service!"}
                  rating={review.rating}
                  delay={`delay-${(index % 3 + 1) * 100}`}
                />
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground">
                Based on {reviews.length} verified review
                {reviews.length !== 1 && "s"}
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
