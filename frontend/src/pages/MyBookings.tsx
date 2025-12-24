import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { bookingApi, Booking } from "@/services/bookingApi";
import {
  Calendar,
  MapPin,
  Clock,
  Loader2,
  FileText,
  XCircle,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: Clock },
  accepted: { label: "Accepted", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-500/10 text-red-600 border-red-500/20", icon: XCircle },
  completed: { label: "Completed", color: "bg-green-500/10 text-green-600 border-green-500/20", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-muted text-muted-foreground border-muted", icon: XCircle },
};

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await bookingApi.getUserBookings();
      setBookings(response.bookings || []);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch bookings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      await bookingApi.cancelBooking(bookingId);
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });
      fetchBookings();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel booking",
        variant: "destructive",
      });
    } finally {
      setCancellingId(null);
    }
  };

  const activeBookings = bookings.filter((b) => ["pending", "accepted"].includes(b.status));
  const pastBookings = bookings.filter((b) => ["completed", "rejected", "cancelled"].includes(b.status));

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-heading font-semibold mb-2">Login Required</h2>
              <p className="text-muted-foreground mb-4">Please login to view your bookings.</p>
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const StatusIcon = statusConfig[booking.status].icon;
    const canCancel = ["pending", "accepted"].includes(booking.status);

    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Service Image */}
            {booking.service?.image && (
              <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={booking.service.image}
                  alt={booking.service.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Details */}
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-heading font-semibold text-lg">
                    {booking.service?.title || "Service"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {booking.service?.category}
                  </p>
                </div>
                <Badge variant="outline" className={statusConfig[booking.status].color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig[booking.status].label}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(booking.preferredDate), "PPP")}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{booking.serviceAddress}</span>
                </div>
              </div>

              {booking.notes && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4 mt-0.5" />
                  <span>{booking.notes}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-muted-foreground">
                  Booked on {format(new Date(booking.createdAt), "PP")}
                </p>

                {canCancel && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        disabled={cancellingId === booking._id}
                      >
                        {cancellingId === booking._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel this booking? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleCancelBooking(booking._id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Yes, Cancel
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold">My Bookings</h1>
              <p className="text-muted-foreground">Track and manage your service bookings</p>
            </div>
            <Button variant="outline" onClick={fetchBookings} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : bookings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-heading font-semibold mb-2">No Bookings Yet</h2>
                <p className="text-muted-foreground mb-6">
                  You haven't made any bookings yet. Browse our services to get started!
                </p>
                <Link to="/services">
                  <Button>Browse Services</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="active" className="space-y-6">
              <TabsList>
                <TabsTrigger value="active">
                  Active ({activeBookings.length})
                </TabsTrigger>
                <TabsTrigger value="past">
                  Past ({pastBookings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                {activeBookings.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">No active bookings</p>
                    </CardContent>
                  </Card>
                ) : (
                  activeBookings.map((booking) => (
                    <BookingCard key={booking._id} booking={booking} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-4">
                {pastBookings.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">No past bookings</p>
                    </CardContent>
                  </Card>
                ) : (
                  pastBookings.map((booking) => (
                    <BookingCard key={booking._id} booking={booking} />
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
