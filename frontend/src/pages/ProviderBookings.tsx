import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { bookingApi, Booking } from "@/services/bookingApi";
import { cn } from "@/lib/utils";
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
  Mail,
  LayoutGrid,
  List,
  Eye,
  DollarSign,
  ClipboardList,
  CalendarDays,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  format,
  formatDistanceToNow,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths, subMonths,
  isWithinInterval,
  startOfDay,
  endOfDay
} from "date-fns";

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: Clock, dotColor: "bg-yellow-500" },
  accepted: { label: "Accepted", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: CheckCircle, dotColor: "bg-blue-500" },
  rejected: { label: "Rejected", color: "bg-red-500/10 text-red-600 border-red-500/20", icon: XCircle, dotColor: "bg-red-500" },
  completed: { label: "Completed", color: "bg-green-500/10 text-green-600 border-green-500/20", icon: CheckCircle, dotColor: "bg-green-500" },
  cancelled: { label: "Cancelled", color: "bg-muted text-muted-foreground border-muted", icon: XCircle, dotColor: "bg-muted-foreground" },
};

type ViewMode = "cards" | "table" | "calendar";

export default function ProviderBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [showFilters, setShowFilters] = useState(false);

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
      setSelectedBooking(null);
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

  const categories = useMemo(() => {
    const cats = new Set(bookings.map(b => b.service?.category).filter(Boolean));
    return Array.from(cats);
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = booking.user?.name?.toLowerCase().includes(query);
        const matchesEmail = booking.user?.email?.toLowerCase().includes(query);
        const matchesService = booking.service?.title?.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesService) return false;
      }

      if (categoryFilter !== "all" && booking.service?.category !== categoryFilter) {
        return false;
      }

      const bookingDate = new Date(booking.preferredDate);
      if (dateFrom && bookingDate < startOfDay(dateFrom)) return false;
      if (dateTo && bookingDate > endOfDay(dateTo)) return false;

      return true;
    });
  }, [bookings, searchQuery, categoryFilter, dateFrom, dateTo]);

  const pendingBookings = filteredBookings.filter((b) => b.status === "pending");
  const acceptedBookings = filteredBookings.filter((b) => b.status === "accepted");
  const completedBookings = filteredBookings.filter((b) => b.status === "completed");
  const pastBookings = filteredBookings.filter((b) => ["completed", "rejected", "cancelled"].includes(b.status));
  const totalEarnings = bookings.filter(b => b.status === "completed").reduce((sum, b) => sum + (b.service?.price || 0), 0);


  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const hasActiveFilters = searchQuery || categoryFilter !== "all" || dateFrom || dateTo;
  const calendarDays = useMemo(() => {
    const start = startOfMonth(calendarMonth);
    const end = endOfMonth(calendarMonth);
    return eachDayOfInterval({ start, end });
  }, [calendarMonth]);

  const getBookingsForDate = (date: Date) => {
    return filteredBookings.filter(b => isSameDay(new Date(b.preferredDate), date));
  };

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
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
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
                      <span className="truncate max-w-[150px]">{booking.user.email}</span>
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{booking.service?.category}</span>
                    <span>•</span>
                    <span className="font-semibold text-primary">
                      Rs. {booking.service?.price?.toLocaleString()}
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className={statusConfig[booking.status].color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig[booking.status].label}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(booking.preferredDate), "PPP 'at' p")}</span>
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
                  {formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true })}
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>

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
                              Are you sure you want to reject this booking from {booking.user?.name}?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleUpdateStatus(booking._id, "rejected")}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Reject Booking
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

  const BookingTableRow = ({ booking }: { booking: Booking }) => {
    const StatusIcon = statusConfig[booking.status].icon;
    const isPending = booking.status === "pending";
    const isAccepted = booking.status === "accepted";
    const isUpdating = updatingId === booking._id;

    return (
      <TableRow>
        <TableCell>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">{booking.user?.name || "Customer"}</p>
              <p className="text-xs text-muted-foreground">{booking.user?.email}</p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div>
            <p className="font-medium">{booking.service?.title}</p>
            <p className="text-xs text-muted-foreground">{booking.service?.category}</p>
          </div>
        </TableCell>
        <TableCell>
          <div className="text-sm">
            <p>{format(new Date(booking.preferredDate), "PP")}</p>
            <p className="text-xs text-muted-foreground">{format(new Date(booking.preferredDate), "p")}</p>
          </div>
        </TableCell>
        <TableCell>
          <p className="font-semibold">Rs. {booking.service?.price?.toLocaleString()}</p>
        </TableCell>
        <TableCell>
          <Badge variant="outline" className={statusConfig[booking.status].color}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig[booking.status].label}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedBooking(booking)}
            >
              <Eye className="h-4 w-4" />
            </Button>

            {isPending && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleUpdateStatus(booking._id, "rejected")}
                  disabled={isUpdating}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary"
                  onClick={() => handleUpdateStatus(booking._id, "accepted")}
                  disabled={isUpdating}
                >
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                </Button>
              </>
            )}

            {isAccepted && (
              <Button
                variant="ghost"
                size="sm"
                className="text-green-600"
                onClick={() => handleUpdateStatus(booking._id, "completed")}
                disabled={isUpdating}
              >
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  };

  const renderBookingList = (filteredBookings: Booking[], emptyMessage: string, emptyIcon?: React.ReactNode) => {
    if (filteredBookings.length === 0) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            {emptyIcon || <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />}
            <p className="text-muted-foreground">{emptyMessage}</p>
          </CardContent>
        </Card>
      );
    }

    if (viewMode === "table") {
      return (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <BookingTableRow key={booking._id} booking={booking} />
              ))}
            </TableBody>
          </Table>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <BookingCard key={booking._id} booking={booking} />
        ))}
      </div>
    );
  };

  const CalendarView = () => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const firstDayOfMonth = startOfMonth(calendarMonth);
    const startPadding = firstDayOfMonth.getDay();

    return (
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              {format(calendarMonth, "MMMM yyyy")}
            </CardTitle>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCalendarMonth(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Week days header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for padding */}
            {Array.from({ length: startPadding }).map((_, i) => (
              <div key={`pad-${i}`} className="aspect-square" />
            ))}

            {/* Day cells */}
            {calendarDays.map((day) => {
              const dayBookings = getBookingsForDate(day);
              const isToday = isSameDay(day, new Date());
              const isSelected = selectedCalendarDate && isSameDay(day, selectedCalendarDate);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedCalendarDate(isSelected ? null : day)}
                  className={cn(
                    "aspect-square p-1 rounded-lg border transition-all hover:bg-muted/50 relative",
                    isToday && "border-primary",
                    isSelected && "bg-primary/10 border-primary",
                    dayBookings.length > 0 && "bg-muted/30"
                  )}
                >
                  <div className="text-sm font-medium">{format(day, "d")}</div>
                  {dayBookings.length > 0 && (
                    <div className="flex flex-wrap gap-0.5 mt-1 justify-center">
                      {dayBookings.slice(0, 3).map((b) => (
                        <div
                          key={b._id}
                          className={cn("w-1.5 h-1.5 rounded-full", statusConfig[b.status].dotColor)}
                        />
                      ))}
                      {dayBookings.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">+{dayBookings.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected date bookings */}
          {selectedCalendarDate && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Bookings for {format(selectedCalendarDate, "PPPP")}
              </h3>
              {getBookingsForDate(selectedCalendarDate).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No bookings scheduled for this date
                </p>
              ) : (
                <div className="space-y-3">
                  {getBookingsForDate(selectedCalendarDate).map((booking) => {
                    const StatusIcon = statusConfig[booking.status].icon;
                    return (
                      <div
                        key={booking._id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn("w-2 h-full min-h-[40px] rounded-full", statusConfig[booking.status].dotColor)} />
                          <div>
                            <p className="font-medium">{booking.service?.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.user?.name} • {format(new Date(booking.preferredDate), "p")}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className={statusConfig[booking.status].color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[booking.status].label}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold">Booking Management</h1>
              <p className="text-muted-foreground">View and manage your booking requests</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === "cards" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  title="Card View"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  title="Table View"
                >
                  <List className="h-4 w-4" />
                </Button>
                {/* <Button
                  variant={viewMode === "calendar" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("calendar")}
                  title="Calendar View"
                >
                  <CalendarDays className="h-4 w-4" />
                </Button> */}
              </div>
              <Button variant="outline" onClick={fetchBookings} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-yellow-500/10">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">{bookings.filter(b => b.status === "pending").length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-blue-500/10">
                    <ClipboardList className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold">{bookings.filter(b => b.status === "accepted").length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-green-500/10">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{bookings.filter(b => b.status === "completed").length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                    <p className="text-2xl font-bold">Rs. {totalEarnings.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by customer name, email, or service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Quick filters */}
                <div className="flex flex-wrap gap-2">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat!}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Date From */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-[140px] justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "PP") : "From date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Date To */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-[140px] justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "PP") : "To date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>

                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                      <X className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              {hasActiveFilters && (
                <p className="text-sm text-muted-foreground mt-3">
                  Showing {filteredBookings.length} of {bookings.length} bookings
                </p>
              )}
            </CardContent>
          </Card>

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
          ) : viewMode === "calendar" ? (
            <CalendarView />
          ) : (
            <Tabs defaultValue="pending" className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="pending" className="relative">
                  Pending
                  {pendingBookings.length > 0 && (
                    <Badge className="ml-2 h-5 min-w-5 p-0 flex items-center justify-center bg-accent text-accent-foreground">
                      {pendingBookings.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="accepted">
                  Active ({acceptedBookings.length})
                </TabsTrigger>
                <TabsTrigger value="past">
                  History ({pastBookings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                {renderBookingList(
                  pendingBookings,
                  "No pending requests - you're all caught up!",
                  <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                )}
              </TabsContent>

              <TabsContent value="accepted">
                {renderBookingList(
                  acceptedBookings,
                  "No active bookings at the moment"
                )}
              </TabsContent>

              <TabsContent value="past">
                {renderBookingList(
                  pastBookings,
                  "No booking history yet"
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>

      {/* Booking Details Modal */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Booking Details
              {selectedBooking && (
                <Badge variant="outline" className={statusConfig[selectedBooking.status].color}>
                  {statusConfig[selectedBooking.status].label}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedBooking.user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedBooking.user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Service Information */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Service Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Service</p>
                    <p className="font-medium">{selectedBooking.service?.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{selectedBooking.service?.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium text-primary">Rs. {selectedBooking.service?.price?.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Booking Information */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Booking Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Preferred Date</p>
                    <p className="font-medium">{format(new Date(selectedBooking.preferredDate), "PPP 'at' p")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Service Address</p>
                    <p className="font-medium">{selectedBooking.serviceAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Booked On</p>
                    <p className="font-medium">{format(new Date(selectedBooking.createdAt), "PPP 'at' p")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{format(new Date(selectedBooking.updatedAt), "PPP 'at' p")}</p>
                  </div>
                </div>
              </div>

              {/* Customer Notes */}
              {selectedBooking.notes && (
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Customer Notes
                  </h3>
                  <div className="p-4 bg-muted rounded-lg">
                    <p>{selectedBooking.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                {selectedBooking.status === "pending" && (
                  <>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          disabled={updatingId === selectedBooking._id}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject Booking
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reject Booking?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to reject this booking? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleUpdateStatus(selectedBooking._id, "rejected")}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Reject
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Button
                      onClick={() => handleUpdateStatus(selectedBooking._id, "accepted")}
                      disabled={updatingId === selectedBooking._id}
                    >
                      {updatingId === selectedBooking._id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Accept Booking
                    </Button>
                  </>
                )}

                {selectedBooking.status === "accepted" && (
                  <Button
                    onClick={() => handleUpdateStatus(selectedBooking._id, "completed")}
                    disabled={updatingId === selectedBooking._id}
                  >
                    {updatingId === selectedBooking._id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Mark as Completed
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
