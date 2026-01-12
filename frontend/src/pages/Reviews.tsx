import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Star, Filter, User, Loader2, MessageSquare, Briefcase } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { StarRating } from "@/components/reviews/StarRating";
import { reviewsApi, Review } from "@/services/reviewsApi";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const REVIEWS_PER_PAGE = 6;

type SortOption = "newest" | "oldest" | "highest" | "lowest";
type RatingFilter = "all" | "5" | "4" | "3" | "2" | "1";

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await reviewsApi.getPublicReviews(100); // Fetch more for pagination
        setReviews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reviews");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Filter reviews by rating
  const filteredReviews = reviews.filter((review) => {
    if (ratingFilter === "all") return true;
    return review.rating === parseInt(ratingFilter);
  });

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, ratingFilter]);

  // Calculate rating distribution
  const ratingDistribution = reviews.reduce(
    (acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const generatePageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Customer Reviews
              </h1>
              <p className="text-lg text-muted-foreground">
                See what our customers are saying about our services
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-destructive">{error}</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-16">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  No reviews yet. Be the first to share your experience!
                </p>
              </div>
            ) : (
              <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar - Stats & Filters */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Overall Rating Card */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-primary mb-2">
                          {averageRating.toFixed(1)}
                        </div>
                        <StarRating rating={Math.round(averageRating)} size="lg" />
                        <p className="text-muted-foreground mt-2">
                          Based on {reviews.length} reviews
                        </p>
                      </div>

                      {/* Rating Distribution */}
                      <div className="mt-6 space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count = ratingDistribution[rating] || 0;
                          const percentage =
                            reviews.length > 0
                              ? (count / reviews.length) * 100
                              : 0;
                          return (
                            <button
                              key={rating}
                              onClick={() =>
                                setRatingFilter(
                                  ratingFilter === rating.toString()
                                    ? "all"
                                    : (rating.toString() as RatingFilter)
                                )
                              }
                              className={`w-full flex items-center gap-2 p-1 rounded transition-colors ${
                                ratingFilter === rating.toString()
                                  ? "bg-primary/10"
                                  : "hover:bg-muted"
                              }`}
                            >
                              <span className="flex items-center gap-1 text-sm w-12">
                                {rating}
                                <Star className="h-3 w-3 fill-primary text-primary" />
                              </span>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full transition-all"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground w-8 text-right">
                                {count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Filters */}
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Filter className="h-4 w-4" />
                        Filters
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">
                          Sort by
                        </label>
                        <Select
                          value={sortBy}
                          onValueChange={(value) => setSortBy(value as SortOption)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="highest">Highest Rated</SelectItem>
                            <SelectItem value="lowest">Lowest Rated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">
                          Filter by rating
                        </label>
                        <Select
                          value={ratingFilter}
                          onValueChange={(value) =>
                            setRatingFilter(value as RatingFilter)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Ratings</SelectItem>
                            <SelectItem value="5">5 Stars</SelectItem>
                            <SelectItem value="4">4 Stars</SelectItem>
                            <SelectItem value="3">3 Stars</SelectItem>
                            <SelectItem value="2">2 Stars</SelectItem>
                            <SelectItem value="1">1 Star</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {ratingFilter !== "all" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setRatingFilter("all")}
                          className="w-full"
                        >
                          Clear Filter
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-3">
                  {filteredReviews.length === 0 ? (
                    <div className="text-center py-16">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No reviews match your filters
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setRatingFilter("all")}
                        className="mt-4"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <p className="text-muted-foreground">
                          Showing {paginatedReviews.length} of{" "}
                          {filteredReviews.length} reviews
                        </p>
                        {ratingFilter !== "all" && (
                          <Badge variant="secondary">
                            {ratingFilter} Star Reviews
                          </Badge>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {paginatedReviews.map((review) => {
                          const userName =
                            typeof review.user === "object"
                              ? review.user.name
                              : "Anonymous";
                          const initials = userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2);
                          
                          const serviceName =
                            typeof review.service === "object"
                              ? review.service.title
                              : null;
                          const serviceCategory =
                            typeof review.service === "object"
                              ? review.service.category
                              : null;

                          return (
                            <Card key={review._id} className="h-fit">
                              <CardContent className="pt-6">
                                <div className="flex items-start gap-3">
                                  <Avatar className="h-12 w-12">
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                      {initials || (
                                        <User className="h-5 w-5" />
                                      )}
                                    </AvatarFallback>
                                  </Avatar>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <p className="font-medium truncate">
                                        {userName}
                                      </p>
                                      <time className="text-xs text-muted-foreground shrink-0">
                                        {format(
                                          new Date(review.createdAt),
                                          "MMM d, yyyy"
                                        )}
                                      </time>
                                    </div>

                                    {serviceName && (
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

                                    <StarRating
                                      rating={review.rating}
                                      size="sm"
                                      className="mt-1"
                                    />

                                    {review.comment && (
                                      <p className="mt-3 text-muted-foreground">
                                        {review.comment}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="mt-8">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious
                                  onClick={() =>
                                    setCurrentPage((p) => Math.max(1, p - 1))
                                  }
                                  className={
                                    currentPage === 1
                                      ? "pointer-events-none opacity-50"
                                      : "cursor-pointer"
                                  }
                                />
                              </PaginationItem>

                              {generatePageNumbers().map((page, idx) =>
                                page === "ellipsis" ? (
                                  <PaginationItem key={`ellipsis-${idx}`}>
                                    <PaginationEllipsis />
                                  </PaginationItem>
                                ) : (
                                  <PaginationItem key={page}>
                                    <PaginationLink
                                      onClick={() => setCurrentPage(page)}
                                      isActive={currentPage === page}
                                      className="cursor-pointer"
                                    >
                                      {page}
                                    </PaginationLink>
                                  </PaginationItem>
                                )
                              )}

                              <PaginationItem>
                                <PaginationNext
                                  onClick={() =>
                                    setCurrentPage((p) =>
                                      Math.min(totalPages, p + 1)
                                    )
                                  }
                                  className={
                                    currentPage === totalPages
                                      ? "pointer-events-none opacity-50"
                                      : "cursor-pointer"
                                  }
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Reviews;
