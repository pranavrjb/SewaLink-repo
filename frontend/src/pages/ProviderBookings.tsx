import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
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
  User,
  Phone,
  Mail,
} from "lucide-react";
import { format } from "date-fns";

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: Clock },
  accepted: { label: "Accepted", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-500/10 text-red-600 border-red-500/20", icon: XCircle },
  completed: { label: "Completed", color: "bg-green-500/10 text-green-600 border-green-500/20", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-muted text-muted-foreground border-muted", icon: XCircle },
};

export default function ProviderBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await bookingApi.getProviderBookings();
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

  const handleUpdateStatus = async (
    bookingId: string,
    status: "accepted" | "rejected" | "completed"
  ) => {
    setUpdatingId(bookingId);
    try {
      await bookingApi.updateBookingStatus(bookingId, status);
      toast({
        title: "Status Updated",
        description: `Booking has been ${status}.`,
      });
      fetchBookings();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const acceptedBookings = bookings.filter((b) => b.status === "accepted");
  const pastBookings = bookings.filter((b) => ["completed", "rejected", "cancelled"].includes(b.status));

  if (!user || user.role !== "provider") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-heading font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground mb-4">
                This page is only accessible to service providers.
              </p>
              <Link to="/">
                <Button>Go Home</Button>
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
    const isPending = booking.status === "pending";
    const isAccepted = booking.status === "accepted";
    const isUpdating = updatingId === booking._id;

    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Customer Info */}
            <div className="flex items-start gap-4 lg:w-64 flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{booking.user?.name || "Customer"}</h3>
                <div className="text-sm text-muted-foreground space-y-1 mt-1">
                  {booking.user?.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span>{booking.user.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-medium">{booking.service?.title || "Service"}</h4>
                  <p className="text-sm text-muted-foreground">{booking.service?.category}</p>
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
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-start gap-2 text-sm">
                    <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-xs text-muted-foreground mb-1">Customer Notes:</p>
                      <p>{booking.notes}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  Received {format(new Date(booking.createdAt), "PP")}
                </p>

                <div className="flex gap-2">
                  {isPending && (
                    <>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            disabled={isUpdating}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reject Booking?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to reject this booking request?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleUpdateStatus(booking._id, "rejected")}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Reject
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(booking._id, "accepted")}
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept
                          </>
                        )}
                      </Button>
                    </>
                  )}

                  {isAccepted && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(booking._id, "completed")}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Complete
                        </>
                      )}
                    </Button>
                  )}
                </div>
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
              <h1 className="text-3xl font-heading font-bold">Manage Bookings</h1>
              <p className="text-muted-foreground">View and manage incoming booking requests</p>
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
                <p className="text-muted-foreground">
                  You don't have any booking requests yet. They will appear here when customers book your services.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="pending" className="space-y-6">
              <TabsList>
                <TabsTrigger value="pending" className="relative">
                  Pending
                  {pendingBookings.length > 0 && (
                    <Badge className="ml-2 h-5 min-w-5 p-0 flex items-center justify-center bg-accent">
                      {pendingBookings.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="accepted">
                  Accepted ({acceptedBookings.length})
                </TabsTrigger>
                <TabsTrigger value="past">
                  Past ({pastBookings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {pendingBookings.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                      <p className="text-muted-foreground">No pending requests - you're all caught up!</p>
                    </CardContent>
                  </Card>
                ) : (
                  pendingBookings.map((booking) => (
                    <BookingCard key={booking._id} booking={booking} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="accepted" className="space-y-4">
                {acceptedBookings.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">No accepted bookings</p>
                    </CardContent>
                  </Card>
                ) : (
                  acceptedBookings.map((booking) => (
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
