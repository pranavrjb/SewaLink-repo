import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookingFormDialog } from "@/components/booking/BookingFormDialog";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Calendar,
  MessageSquare,
  Share2,
  Heart,
  Award,
  Shield,
  ThumbsUp,
  Briefcase,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { servicesApi, Service } from "@/services/servicesApi";
import { reviewsApi } from "@/services/reviewsApi";
import { api } from "@/lib/api";

interface ProviderData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  createdAt: string;
  role: string;
}

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  helpful?: number;
}

interface BookableService {
  _id: string;
  title: string;
  category: string;
  price: number;
  provider?: {
    name: string;
  };
}

export default function ProviderProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [provider, setProvider] = useState<ProviderData | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<BookableService | null>(null);

  useEffect(() => {
  if (!id) return;

  const fetchProviderData = async () => {
    try {
      setIsLoading(true);

      const data = await servicesApi.getProviderProfile(id);

      setProvider(data.provider);
      setServices(data.services || []);

    }catch (error) {
      toast({
        title: "Error",
        description: "Failed to load provider profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  fetchProviderData();
}, [id, toast]);


  const handleBookService = (service: Service) => {
    setSelectedService({
      _id: service._id,
      title: service.title,
      category: service.category,
      price: service.price,
      provider: {
        name: provider?.name || "Provider",
      },
    });
    setBookingDialogOpen(true);
  };

  const handleBookingSuccess = () => {
    toast({
      title: "Booking Submitted!",
      description: "Your booking request has been sent to the provider.",
    });
  };

  // Calculate rating stats from reviews
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingBreakdown = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  const totalRatings = reviews.length;
  const getRatingPercentage = (count: number) => totalRatings > 0 ? (count / totalRatings) * 100 : 0;

  const memberSince = provider?.createdAt
    ? new Date(provider.createdAt).getFullYear().toString()
    : "N/A";

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-heading font-bold">Provider Not Found</h1>
          <p className="text-muted-foreground">The provider you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/providers")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Providers
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-accent/5 pt-8 pb-12">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => navigate("/providers")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Providers
            </Button>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Provider Info Card */}
              <Card className="w-full lg:w-96 animate-fade-up">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-28 w-28 border-4 border-primary/20">
                      <AvatarImage src={provider.avatar} alt={provider.name} />
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {provider.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <h1 className="text-2xl font-heading font-bold">{provider.name}</h1>
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>

                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-5 w-5 fill-accent text-accent" />
                        <span className="font-semibold">{averageRating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({reviews.length} reviews)</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                      {services.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {services.length} Services
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        Since {memberSince}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6 w-full text-center">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-primary">{services.length}</p>
                        <p className="text-xs text-muted-foreground">Services</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-primary">{reviews.length}</p>
                        <p className="text-xs text-muted-foreground">Reviews</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-6 w-full">
                      <Button
                        className="flex-1"
                        size="lg"
                        onClick={() => services[0] && handleBookService(services[0])}
                        disabled={services.length === 0}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>
                      {/* <Button variant="outline" size="lg">
                        <MessageSquare className="h-4 w-4" />
                      </Button> */}
                    </div>

                    <div className="flex gap-4 mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsFavorite(!isFavorite)}
                        className={isFavorite ? "text-destructive" : ""}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${isFavorite ? "fill-current" : ""}`} />
                        Save
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Main Content */}
              <div className="flex-1 space-y-6">
                {/* Quick Info */}
                <Card className="animate-fade-up delay-100">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {provider.location && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-medium">{provider.location}</p>
                          </div>
                        </div>
                      )}
                      {provider.phone && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Phone className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="font-medium">{provider.phone}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium text-sm">{provider.email}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* About */}
                <Card className="animate-fade-up delay-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      About
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {provider.bio || `${provider.name} is a verified service provider on our platform.`}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-6">
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>Verified Provider</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-primary" />
                        <span>Member since {memberSince}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Background Checked</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="services" className="space-y-6">
            <TabsList className="w-full justify-start flex-wrap h-auto gap-2 bg-transparent p-0">
              <TabsTrigger value="services" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Services & Pricing ({services.length})
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Reviews ({reviews.length})
              </TabsTrigger>
            </TabsList>

            {/* Services Tab */}
            <TabsContent value="services" className="animate-fade-in">
              {services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <Card key={service._id} className="card-hover relative overflow-hidden">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{service.title}</CardTitle>
                            <Badge variant="outline" className="mt-2">{service.category}</Badge>
                          </div>
                        </div>
                        <CardDescription className="mt-2">{service.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="text-2xl font-bold text-primary">Rs.{service.price}</span>
                          </div>
                          <Button size="sm" onClick={() => handleBookService(service)}>Book</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Services Listed</h3>
                    <p className="text-muted-foreground">This provider hasn't listed any services yet.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Rating Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Rating Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-5xl font-bold">{averageRating.toFixed(1)}</div>
                      <div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${
                                star <= Math.floor(averageRating)
                                  ? "fill-accent text-accent"
                                  : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Based on {reviews.length} reviews
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-sm w-3">{stars}</span>
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          <Progress
                            value={getRatingPercentage(ratingBreakdown[stars as keyof typeof ratingBreakdown])}
                            className="flex-1 h-2"
                          />
                          <span className="text-sm text-muted-foreground w-8">
                            {ratingBreakdown[stars as keyof typeof ratingBreakdown]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <Card key={review._id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={review.user?.avatar} />
                                <AvatarFallback className="bg-secondary">
                                  {review.user?.name?.split(" ").map(n => n[0]).join("") || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{review.user?.name || "Anonymous"}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? "fill-accent text-accent"
                                      : "text-muted"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="mt-4 text-muted-foreground">{review.comment}</p>
                          <div className="mt-4 flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              Helpful ({review.helpful || 0})
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                        <p className="text-muted-foreground">Be the first to review this provider!</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      <BookingFormDialog
        open={bookingDialogOpen}
        onOpenChange={setBookingDialogOpen}
        service={selectedService}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
}
