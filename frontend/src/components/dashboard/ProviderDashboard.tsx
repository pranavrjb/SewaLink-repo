import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import {
  Calendar,
  Clock,
  Star,
  DollarSign,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  MessageSquare,
  Settings,
  Loader2,
  History,
  RefreshCw
} from "lucide-react";
import { bookingApi, Booking } from "@/services/bookingApi";
import { reviewsApi } from "@/services/reviewsApi";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ProviderDashboardProps {
  user: User;
}

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  } | string;
  service?: {
    _id: string;
    title: string;
    category?: string;
  };
  rating: number;
  comment?: string;
  createdAt: string;
}

const ProviderDashboard = ({ user }: ProviderDashboardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);

  const fetchDashboardData = async (showLoader = true) => {
    try {
      if (showLoader) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      // Fetch bookings
      const bookingRes = await bookingApi.getProviderBookings();
      setBookings(bookingRes.bookings || []);

      // Fetch reviews
      try {
        const reviewRes = await reviewsApi.getProviderReviews();
        setReviews(reviewRes.reviews || []);
      } catch (reviewError: any) {
        console.error("Failed to fetch reviews:", reviewError);
        // Don't fail the whole request if reviews fail
        setReviews([]);
        if (reviewError.response?.status === 404) {
          console.log("No reviews found - this is normal for new providers");
        }
      }

      if (!showLoader) {
        toast({
          title: "Dashboard Updated",
          description: "Your dashboard data has been refreshed.",
        });
      }
    } catch (error: any) {
      console.error("Provider dashboard error", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load dashboard data",
        variant: "destructive",
      });
      setBookings([]);
      setReviews([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 30 seconds instead of 15 to reduce load
    const interval = setInterval(() => {
      fetchDashboardData(false);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Filter bookings
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const status = (s?: string) => s?.toLowerCase() || "";

  const completedBookings = bookings.filter(
    (b) => status(b.status) === "completed"
  );

  const todaysBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.preferredDate);
    return (
      bookingDate >= today &&
      bookingDate < tomorrow &&
      ["pending", "accepted"].includes(status(b.status))
    );
  });

  const pendingEarnings = bookings
    .filter((b) => status(b.status) === "accepted")
    .reduce((sum, b) => sum + (b.service?.price || 0), 0);

  const monthlyCompleted = completedBookings.filter((b) => {
    const bookingDate = new Date(b.createdAt);
    const thisMonth = new Date();
    return bookingDate.getMonth() === thisMonth.getMonth() &&
      bookingDate.getFullYear() === thisMonth.getFullYear();
  });

  const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.service?.price || 0), 0);
  const monthlyEarnings = monthlyCompleted.reduce((sum, b) => sum + (b.service?.price || 0), 0);
  const weeklyEarnings = completedBookings.filter((b) => {
    const bookingDate = new Date(b.createdAt);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return bookingDate >= oneWeekAgo;
  }).reduce((sum, b) => sum + (b.service?.price || 0), 0);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "N/A";

  return (
    <div className="container py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                Provider Dashboard
              </h1>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Provider
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Welcome back, {user.name}! Here's your business overview.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDashboardData(false)}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Bookings</p>
                <p className="text-2xl font-heading font-bold text-foreground">
                  {isLoading ? "-" : todaysBookings.length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-accent/10 border-accent/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-heading font-bold text-foreground">
                  {isLoading ? "-" : monthlyCompleted.length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-heading font-bold text-foreground">
                  Rs.{isLoading ? "-" : totalEarnings}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="text-2xl font-heading font-bold text-foreground">
                  {isLoading ? "-" : averageRating}
                </p>
              </div>
              <Star className="w-8 h-8 text-accent fill-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your appointments for today</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/provider-bookings")}>
                View Calendar
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : todaysBookings.length > 0 ? (
                todaysBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{booking.service?.title || "Service"}</h4>
                        <p className="text-sm text-muted-foreground">{booking.user?.name || "Customer"}</p>
                        <p className="text-xs text-muted-foreground">{booking.serviceAddress}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">
                        {format(new Date(booking.preferredDate), "h:mm a")}
                      </p>
                      <p className="text-sm text-foreground">Rs.{booking.service?.price || 0}</p>
                      <Badge variant="outline" className={
                        booking.status === "accepted"
                          ? "bg-primary/10 text-primary border-primary/20 mt-1"
                          : "bg-accent/10 text-accent border-accent/20 mt-1"
                      }>
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No bookings scheduled for today</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Reviews</CardTitle>
                <CardDescription>What your customers are saying</CardDescription>
              </div>
              {reviews.length > 3 && (
                <Button variant="link" size="sm">
                  View All ({reviews.length})
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : reviews.length > 0 ? (
                reviews.slice(0, 3).map((review) => {
                  const userName = typeof review.user === 'object' ? review.user?.name : null;
                  return (
                    <div key={review._id} className="p-4 border border-border rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                            <span className="text-sm font-medium">{userName?.charAt(0) || "?"}</span>
                          </div>
                          <div>
                            <span className="font-medium text-sm">{userName || "Anonymous"}</span>
                            {review.service && (
                              <p className="text-xs text-muted-foreground">{review.service.title}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? "fill-accent text-accent" : "text-muted"
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(new Date(review.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No reviews yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Complete bookings to start receiving reviews
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Earnings Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Earnings Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">This Week</span>
                  <span className="font-semibold">Rs.{isLoading ? "-" : weeklyEarnings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">This Month</span>
                  <span className="font-semibold">Rs.{isLoading ? "-" : monthlyEarnings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-semibold text-accent">Rs.{isLoading ? "-" : pendingEarnings}</span>
                </div>
                <Button
                  className="w-full mt-4"
                  variant="outline"
                  onClick={() => setShowPaymentHistory(!showPaymentHistory)}
                >
                  <History className="w-4 h-4 mr-2" />
                  {showPaymentHistory ? "Hide" : "View"} Payment History
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          {showPaymentHistory && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Payment History
                </CardTitle>
                <CardDescription>Completed task payments</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : completedBookings.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {completedBookings.slice(0, 10).map((booking) => (
                      <div key={booking._id} className="p-3 bg-secondary/30 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{booking.service?.title || "Service"}</p>
                            <p className="text-xs text-muted-foreground">{booking.user?.name || "Customer"}</p>
                          </div>
                          <span className="font-semibold text-primary">Rs.{booking.service?.price || 0}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(booking.updatedAt || booking.createdAt), "MMM d, yyyy")}
                          <Clock className="w-3 h-3 ml-2" />
                          {format(new Date(booking.updatedAt || booking.createdAt), "h:mm a")}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">No completed payments</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-between" variant="outline" onClick={() => navigate("/provider-bookings")}>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Manage Bookings
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button className="w-full justify-between" variant="outline" onClick={() => navigate("/profile")}>
                <span className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Profile Settings
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completion Rate</span>
                    <span className="font-medium">
                      {bookings.length > 0
                        ? Math.round((completedBookings.length / bookings.length) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{
                        width: `${bookings.length > 0
                          ? Math.round((completedBookings.length / bookings.length) * 100)
                          : 0}%`
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Average Rating</span>
                    <span className="font-medium">{averageRating}/5</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all"
                      style={{
                        width: `${reviews.length > 0 && averageRating !== "N/A"
                          ? (parseFloat(averageRating as string) / 5) * 100
                          : 0}%`
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Total Reviews</span>
                    <span className="font-medium">{reviews.length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;