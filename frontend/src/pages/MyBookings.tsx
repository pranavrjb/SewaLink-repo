import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ReviewForm } from "@/components/reviews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  LayoutGrid,
  CalendarDays,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  DollarSign,
  User,
  ClipboardList,
  Star,
} from "lucide-react";
import { format, formatDistanceToNow, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, startOfDay, endOfDay } from "date-fns";

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: Clock, dotColor: "bg-yellow-500" },
  accepted: { label: "Accepted", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: CheckCircle, dotColor: "bg-blue-500" },
  rejected: { label: "Rejected", color: "bg-red-500/10 text-red-600 border-red-500/20", icon: XCircle, dotColor: "bg-red-500" },
  completed: { label: "Completed", color: "bg-green-500/10 text-green-600 border-green-500/20", icon: CheckCircle, dotColor: "bg-green-500" },
  cancelled: { label: "Cancelled", color: "bg-muted text-muted-foreground border-muted", icon: XCircle, dotColor: "bg-muted-foreground" },
};

type ViewMode = "cards" | "calendar";

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);

  // Review state
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [reviewedBookings, setReviewedBookings] = useState<Set<string>>(new Set());

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

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
      setSelectedBooking(null);
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

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(bookings.map(b => b.service?.category).filter(Boolean));
    return Array.from(cats);
  }, [bookings]);

  // Apply filters
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesService = booking.service?.title?.toLowerCase().includes(query);
        const matchesProvider = booking.service?.provider?.name?.toLowerCase().includes(query);
        if (!matchesService && !matchesProvider) return false;
      }

      // Category filter
      if (categoryFilter !== "all" && booking.service?.category !== categoryFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all" && booking.status !== statusFilter) {
        return false;
      }

      // Date range filter
      const bookingDate = new Date(booking.preferredDate);
      if (dateFrom && bookingDate < startOfDay(dateFrom)) return false;
      if (dateTo && bookingDate > endOfDay(dateTo)) return false;

      return true;
    });
  }, [bookings, searchQuery, categoryFilter, statusFilter, dateFrom, dateTo]);

  const activeBookings = filteredBookings.filter((b) => ["pending", "accepted"].includes(b.status));
  const pastBookings = filteredBookings.filter((b) => ["completed", "rejected", "cancelled"].includes(b.status));

  // Stats calculations
  const totalSpent = bookings.filter(b => b.status === "completed").reduce((sum, b) => sum + (b.service?.price || 0), 0);
  const pendingCount = bookings.filter(b => b.status === "pending").length;
  const completedCount = bookings.filter(b => b.status === "completed").length;

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const hasActiveFilters = searchQuery || categoryFilter !== "all" || statusFilter !== "all" || dateFrom || dateTo;

  // Calendar view helpers
  const calendarDays = useMemo(() => {
    const start = startOfMonth(calendarMonth);
    const end = endOfMonth(calendarMonth);
    return eachDayOfInterval({ start, end });
  }, [calendarMonth]);

  const getBookingsForDate = (date: Date) => {
    return filteredBookings.filter(b => isSameDay(new Date(b.preferredDate), date));
  };

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
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{booking.service?.category}</span>
                    <span>•</span>
                    <span className="font-semibold text-primary">
                      Rs. {booking.service?.price?.toLocaleString()}
                    </span>
                  </div>
                  {booking.service?.provider?.name && (
                    <p className="text-sm text-muted-foreground mt-1">
                      by {booking.service.provider.name}
                    </p>
                  )}
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
                      <p className="font-medium text-xs text-muted-foreground mb-1">Your Notes:</p>
                      <p>{booking.notes}</p>
                    </div>
                  </div>
                </div>
              )}

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

                  {booking.status === "completed" && !reviewedBookings.has(booking._id) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReviewBooking(booking)}
                    >
                      <Star className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                  )}

                  {reviewedBookings.has(booking._id) && (
                    <Badge variant="outline" className="text-green-600 border-green-500/20">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Reviewed
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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
                              {booking.service?.provider?.name} • {format(new Date(booking.preferredDate), "p")}
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
              <h1 className="text-3xl font-heading font-bold">My Bookings</h1>
              <p className="text-muted-foreground">Track and manage your service bookings</p>
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
                  variant={viewMode === "calendar" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("calendar")}
                  title="Calendar View"
                >
                  <CalendarDays className="h-4 w-4" />
                </Button>
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
                  <div className="p-3 rounded-full bg-blue-500/10">
                    <ClipboardList className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-bold">{bookings.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-yellow-500/10">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">{pendingCount}</p>
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
                    <p className="text-2xl font-bold">{completedCount}</p>
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
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold">Rs. {totalSpent.toLocaleString()}</p>
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
                    placeholder="Search by service or provider name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Quick filters */}
                <div className="flex flex-wrap gap-2">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[160px]">
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

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Date From */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-[130px] justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "PP") : "From"}
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
                      <Button variant="outline" className={cn("w-[130px] justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "PP") : "To"}
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
                <p className="text-muted-foreground mb-6">
                  You haven't made any bookings yet. Browse our services to get started!
                </p>
                <Link to="/services">
                  <Button>Browse Services</Button>
                </Link>
              </CardContent>
            </Card>
          ) : viewMode === "calendar" ? (
            <CalendarView />
          ) : (
            <Tabs defaultValue="active" className="space-y-6">
              <TabsList className="grid w-full max-w-xs grid-cols-2">
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
                      <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
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
                    <p className="text-sm text-muted-foreground">Provider</p>
                    <p className="font-medium">{selectedBooking.service?.provider?.name || "N/A"}</p>
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
                    <p className="text-sm text-muted-foreground">Scheduled Date</p>
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

              {/* Notes */}
              {selectedBooking.notes && (
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Your Notes
                  </h3>
                  <div className="p-4 bg-muted rounded-lg">
                    <p>{selectedBooking.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                {selectedBooking.status === "completed" && !reviewedBookings.has(selectedBooking._id) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedBooking(null);
                      setReviewBooking(selectedBooking);
                    }}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Leave a Review
                  </Button>
                )}

                {selectedBooking.status === "completed" && reviewedBookings.has(selectedBooking._id) && (
                  <Badge variant="outline" className="text-green-600 border-green-500/20 px-4 py-2">
                    <Star className="h-4 w-4 mr-2 fill-current" />
                    You reviewed this service
                  </Badge>
                )}

                {["pending", "accepted"].includes(selectedBooking.status) && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        disabled={cancellingId === selectedBooking._id}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Booking
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
                          onClick={() => handleCancelBooking(selectedBooking._id)}
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
          )}
        </DialogContent>
      </Dialog>

      {/* Review Form Dialog */}
      {reviewBooking && (
        <ReviewForm
          open={!!reviewBooking}
          onOpenChange={(open) => !open && setReviewBooking(null)}
          bookingId={reviewBooking._id}
          serviceName={reviewBooking.service?.title || "Service"}
          onSuccess={() => {
            setReviewedBookings((prev) => new Set([...prev, reviewBooking._id]));
            setReviewBooking(null);
          }}
        />
      )}

      <Footer />
    </div>
  );
}
