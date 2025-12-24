import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Clock, 
  Star, 
  ArrowRight,
  CheckCircle,
  Loader2
} from "lucide-react";
import { bookingApi, Booking } from "@/services/bookingApi";
import { format } from "date-fns";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserDashboardProps {
  user: User;
}

const UserDashboard = ({ user }: UserDashboardProps) => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingApi.getUserBookings();
        setBookings(response.bookings || []);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const upcomingBookings = bookings.filter((b) => ["pending", "accepted"].includes(b.status));
  const pastBookings = bookings.filter((b) => ["completed", "rejected", "cancelled"].includes(b.status));
  const completedCount = bookings.filter((b) => b.status === "completed").length;
  const totalSpent = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + (b.service?.price || 0), 0);

  return (
    <div className="container py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
          Welcome back, {user.name.split(" ")[0]}! 👋
        </h1>
        <p className="text-muted-foreground">
          Manage your bookings and explore new services
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-heading font-bold text-foreground">
                  {isLoading ? "-" : upcomingBookings.length}
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
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-heading font-bold text-foreground">
                  {isLoading ? "-" : completedCount}
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
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-heading font-bold text-foreground">
                  ${isLoading ? "-" : totalSpent}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-lg">
                💰
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-heading font-bold text-foreground">
                  {isLoading ? "-" : bookings.length}
                </p>
              </div>
              <Star className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Bookings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Bookings</CardTitle>
                <CardDescription>Your scheduled services</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/my-bookings")}>
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : upcomingBookings.length > 0 ? (
                upcomingBookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{booking.service?.title || "Service"}</h4>
                      <p className="text-sm text-muted-foreground">by {booking.service?.provider?.name || "Provider"}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(booking.preferredDate), "MMM d, yyyy")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {format(new Date(booking.preferredDate), "h:mm a")}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">${booking.service?.price || 0}</p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          booking.status === "accepted"
                            ? "bg-primary/10 text-primary"
                            : "bg-accent/10 text-accent"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No upcoming bookings</p>
                  <Button className="mt-4" onClick={() => navigate("/services")}>
                    Book a Service
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Past Bookings */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent History</CardTitle>
              <CardDescription>Your past services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : pastBookings.length > 0 ? (
                pastBookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between p-4 border border-border rounded-xl"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{booking.service?.title || "Service"}</h4>
                      <p className="text-sm text-muted-foreground">by {booking.service?.provider?.name || "Provider"}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {format(new Date(booking.preferredDate), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">${booking.service?.price || 0}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        booking.status === "completed" 
                          ? "bg-green-500/10 text-green-600" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No past bookings</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-between" variant="outline" onClick={() => navigate("/services")}>
                Book New Service
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button className="w-full justify-between" variant="outline" onClick={() => navigate("/services")}>
                View All Services
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button className="w-full justify-between" variant="outline" onClick={() => navigate("/my-bookings")}>
                My Bookings
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button className="w-full justify-between" variant="outline" onClick={() => navigate("/profile")}>
                Edit Profile
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Have questions about your booking or need support?
              </p>
              <Button className="w-full" variant="default" onClick={() => navigate("/help")}>
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;