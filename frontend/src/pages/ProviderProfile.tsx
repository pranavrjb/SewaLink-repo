import {useState} from 'react';
import { useParams } from "react-router-dom";
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
} from "lucide-react";

// Mock provider data - in real app, this would come from API
const mockProvider = {
  id: "1",
  name: "John's Plumbing Services",
  ownerName: "John Smith",
  avatar: "",
  coverImage: "",
  bio: "Professional plumbing services with over 15 years of experience. We specialize in residential and commercial plumbing, offering reliable and affordable solutions for all your needs.",
  phone: "+1 (555) 123-4567",
  email: "john@plumbingservices.com",
  location: "Los Angeles, CA",
  rating: 4.8,
  totalReviews: 156,
  completedJobs: 342,
  memberSince: "2019",
  responseTime: "Within 1 hour",
  isVerified: true,
  badges: ["Top Rated", "Quick Response", "5+ Years"],
  services: [
    { id: "1", name: "Pipe Repair", description: "Fix leaky or burst pipes", price: 85, priceType: "per hour", popular: true },
    { id: "2", name: "Drain Cleaning", description: "Clear clogged drains and sinks", price: 120, priceType: "flat rate", popular: true },
    { id: "3", name: "Water Heater Installation", description: "Install or replace water heaters", price: 350, priceType: "starting at", popular: false },
    { id: "4", name: "Toilet Repair", description: "Fix running or clogged toilets", price: 95, priceType: "per hour", popular: false },
    { id: "5", name: "Faucet Installation", description: "Install new faucets and fixtures", price: 75, priceType: "per hour", popular: false },
    { id: "6", name: "Emergency Services", description: "24/7 emergency plumbing support", price: 150, priceType: "per hour", popular: true },
  ],
  availability: {
    monday: { available: true, hours: "8:00 AM - 6:00 PM" },
    tuesday: { available: true, hours: "8:00 AM - 6:00 PM" },
    wednesday: { available: true, hours: "8:00 AM - 6:00 PM" },
    thursday: { available: true, hours: "8:00 AM - 6:00 PM" },
    friday: { available: true, hours: "8:00 AM - 6:00 PM" },
    saturday: { available: true, hours: "9:00 AM - 3:00 PM" },
    sunday: { available: false, hours: "Closed" },
  },
  reviews: [
    {
      id: "1",
      author: "Sarah M.",
      avatar: "",
      rating: 5,
      date: "2024-01-15",
      comment: "Excellent service! John fixed our leaky pipe quickly and professionally. Very fair pricing and great communication throughout.",
      helpful: 12,
    },
    {
      id: "2",
      author: "Michael R.",
      avatar: "",
      rating: 5,
      date: "2024-01-10",
      comment: "Called for an emergency at 10 PM and John arrived within 30 minutes. Life saver! Highly recommend for any plumbing needs.",
      helpful: 8,
    },
    {
      id: "3",
      author: "Lisa T.",
      avatar: "",
      rating: 4,
      date: "2024-01-05",
      comment: "Good work on our water heater installation. A bit pricey but the quality is excellent. Would use again.",
      helpful: 5,
    },
    {
      id: "4",
      author: "David K.",
      avatar: "",
      rating: 5,
      date: "2023-12-28",
      comment: "Very professional and knowledgeable. Explained everything clearly and cleaned up after the job. Great experience!",
      helpful: 15,
    },
  ],
  ratingBreakdown: {
    5: 120,
    4: 25,
    3: 8,
    2: 2,
    1: 1,
  },
};

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
  const [isFavorite, setIsFavorite] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<BookableService | null>(null);
  const { toast } = useToast();
  
  // In real app, fetch provider data based on id
  const provider = mockProvider;

  const handleBookService = (service: typeof provider.services[0]) => {
    setSelectedService({
      _id: service.id,
      title: service.name,
      category: "Plumbing", // From provider category
      price: service.price,
      provider: {
        name: provider.name,
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

  const totalRatings = Object.values(provider.ratingBreakdown).reduce((a, b) => a + b, 0);

  const getRatingPercentage = (count: number) => (count / totalRatings) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-accent/5 pt-8 pb-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Provider Info Card */}
              <Card className="w-full lg:w-96 animate-fade-up">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-28 w-28 border-4 border-primary/20">
                      <AvatarImage src={provider.avatar} alt={provider.name} />
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {provider.ownerName.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <h1 className="text-2xl font-heading font-bold">{provider.name}</h1>
                        {provider.isVerified && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <p className="text-muted-foreground">{provider.ownerName}</p>
                      
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-5 w-5 fill-accent text-accent" />
                        <span className="font-semibold">{provider.rating}</span>
                        <span className="text-muted-foreground">({provider.totalReviews} reviews)</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                      {provider.badges.map((badge) => (
                        <Badge key={badge} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6 w-full text-center">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-primary">{provider.completedJobs}</p>
                        <p className="text-xs text-muted-foreground">Jobs Completed</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-primary">{provider.memberSince}</p>
                        <p className="text-xs text-muted-foreground">Member Since</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-6 w-full">
                      <Button 
                        className="flex-1" 
                        size="lg"
                        onClick={() => handleBookService(provider.services[0])}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>
                      <Button variant="outline" size="lg">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="font-medium">{provider.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Response Time</p>
                          <p className="font-medium">{provider.responseTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{provider.phone}</p>
                        </div>
                      </div>
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
                    <p className="text-muted-foreground leading-relaxed">{provider.bio}</p>
                    <div className="flex flex-wrap gap-4 mt-6">
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>Licensed & Insured</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-primary" />
                        <span>15+ Years Experience</span>
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
                Services & Pricing
              </TabsTrigger>
              <TabsTrigger value="availability" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Availability
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Reviews ({provider.totalReviews})
              </TabsTrigger>
            </TabsList>

            {/* Services Tab */}
            <TabsContent value="services" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {provider.services.map((service) => (
                  <Card key={service.id} className="card-hover relative overflow-hidden">
                    {service.popular && (
                      <Badge className="absolute top-4 right-4 bg-accent">Popular</Badge>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-2xl font-bold text-primary">${service.price}</span>
                          <span className="text-sm text-muted-foreground ml-1">{service.priceType}</span>
                        </div>
                        <Button size="sm" onClick={() => handleBookService(service)}>Book</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Availability Tab */}
            <TabsContent value="availability" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Schedule</CardTitle>
                  <CardDescription>Business hours for booking appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(provider.availability).map(([day, schedule]) => (
                      <div
                        key={day}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          schedule.available ? "bg-muted" : "bg-muted/50"
                        }`}
                      >
                        <span className="font-medium capitalize">{day}</span>
                        <div className="flex items-center gap-2">
                          {schedule.available ? (
                            <>
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                Open
                              </Badge>
                              <span className="text-muted-foreground">{schedule.hours}</span>
                            </>
                          ) : (
                            <Badge variant="secondary">Closed</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Note:</strong> Emergency services available 24/7. 
                      Additional charges may apply for after-hours calls.
                    </p>
                  </div>
                </CardContent>
              </Card>
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
                      <div className="text-5xl font-bold">{provider.rating}</div>
                      <div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${
                                star <= Math.floor(provider.rating)
                                  ? "fill-accent text-accent"
                                  : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Based on {provider.totalReviews} reviews
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-sm w-3">{stars}</span>
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          <Progress
                            value={getRatingPercentage(provider.ratingBreakdown[stars as keyof typeof provider.ratingBreakdown])}
                            className="flex-1 h-2"
                          />
                          <span className="text-sm text-muted-foreground w-8">
                            {provider.ratingBreakdown[stars as keyof typeof provider.ratingBreakdown]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-4">
                  {provider.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={review.avatar} />
                              <AvatarFallback className="bg-secondary">
                                {review.author.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{review.author}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(review.date).toLocaleDateString("en-US", {
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
                            Helpful ({review.helpful})
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" className="w-full">
                    Load More Reviews
                  </Button>
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