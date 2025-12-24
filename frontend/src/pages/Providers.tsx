import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Star,
  MapPin,
  Filter,
  X,
  CheckCircle,
  Clock,
  SlidersHorizontal,
  Grid3X3,
  List,
  Plus,
  Loader2,
} from "lucide-react";
import { servicesApi, Service } from "@/services/servicesApi";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface Provider {
  id: string;
  name: string;
  ownerName: string;
  avatar: string;
  serviceType: string;
  location: string;
  rating: number;
  totalReviews: number;
  completedJobs: number;
  pricePerHour: number;
  isVerified: boolean;
  responseTime: string;
  badges: string[];
  description: string;
}

const serviceTypes = [
  "All Services",
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Carpentry",
  "Painting",
  "HVAC",
  "Gardening",
  "Pest Control",
];

const locations = [
  "All Locations",
  "Los Angeles, CA",
  "San Francisco, CA",
  "San Diego, CA",
];

const sortOptions = [
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviews" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "jobs", label: "Most Jobs Completed" },
];

// Provider Card Component
interface ProviderCardProps {
  provider: Provider;
  isListView?: boolean;
}

const ProviderCard = ({ provider, isListView = false }: ProviderCardProps) => (
  <Card className={`card-hover overflow-hidden ${isListView ? "flex flex-col md:flex-row" : ""}`}>
    <CardContent className={`p-6 ${isListView ? "flex-1 flex flex-col md:flex-row gap-6" : ""}`}>
      <div className={`flex ${isListView ? "flex-col md:flex-row items-start md:items-center gap-4 flex-1" : "flex-col"}`}>
        {/* Avatar and Basic Info */}
        <div className={`flex items-center gap-4 ${isListView ? "" : "mb-4"}`}>
          <Avatar className={`${isListView ? "h-16 w-16" : "h-14 w-14"} border-2 border-primary/20`}>
            <AvatarImage src={provider.avatar} alt={provider.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {provider.ownerName.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-semibold text-lg truncate">{provider.name}</h3>
              {provider.isVerified && (
                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{provider.ownerName}</p>
          </div>
        </div>

        {/* Details */}
        <div className={`space-y-3 ${isListView ? "flex-1" : "mb-4"}`}>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-medium">{provider.rating}</span>
              <span className="text-muted-foreground">({provider.totalReviews})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{provider.location}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{provider.responseTime}</span>
            </div>
          </div>

          <Badge variant="secondary" className="text-xs">
            {provider.serviceType}
          </Badge>

          {isListView && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {provider.description}
            </p>
          )}

          <div className="flex flex-wrap gap-1.5">
            {provider.badges.map((badge) => (
              <Badge key={badge} variant="outline" className="text-xs bg-primary/5 border-primary/20">
                {badge}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Price and CTA */}
      <div className={`flex ${isListView ? "flex-col justify-center items-end gap-2" : "items-center justify-between"} mt-4 pt-4 border-t`}>
        <div className={isListView ? "text-right" : ""}>
          <span className="text-2xl font-bold text-primary">${provider.pricePerHour}</span>
          <span className="text-sm text-muted-foreground">/hr</span>
        </div>
        <Link to={`/provider/${provider.id}`}>
          <Button>View Profile</Button>
        </Link>
      </div>
    </CardContent>
  </Card>
);

// Filter Content Component
interface FilterContentProps {
  selectedService: string;
  setSelectedService: (value: string) => void;
  selectedLocation: string;
  setSelectedLocation: (value: string) => void;
  minRating: number;
  setMinRating: (value: number) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  categories: string[];
}

const FilterContent = ({
  selectedService,
  setSelectedService,
  selectedLocation,
  setSelectedLocation,
  minRating,
  setMinRating,
  priceRange,
  setPriceRange,
  hasActiveFilters,
  clearFilters,
  categories,
}: FilterContentProps) => (
  <div className="space-y-6">
    {/* Service Type */}
    <div>
      <label className="text-sm font-medium mb-2 block">Service Type</label>
      <Select value={selectedService} onValueChange={setSelectedService}>
        <SelectTrigger className="bg-background">
          <SelectValue placeholder="Select service" />
        </SelectTrigger>
        <SelectContent className="bg-popover border border-border z-50">
          {categories.map((service) => (
            <SelectItem key={service} value={service}>
              {service}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Location */}
    <div>
      <label className="text-sm font-medium mb-2 block">Location</label>
      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
        <SelectTrigger className="bg-background">
          <SelectValue placeholder="Select location" />
        </SelectTrigger>
        <SelectContent className="bg-popover border border-border z-50">
          {locations.map((location) => (
            <SelectItem key={location} value={location}>
              {location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Minimum Rating */}
    <div>
      <label className="text-sm font-medium mb-2 block">
        Minimum Rating: {minRating > 0 ? `${minRating}+ stars` : "Any"}
      </label>
      <div className="flex flex-wrap gap-2 mt-2">
        {[0, 3, 3.5, 4, 4.5].map((rating) => (
          <button
            key={rating}
            onClick={() => setMinRating(rating)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
              minRating === rating
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {rating === 0 ? (
              "Any"
            ) : (
              <>
                {rating}
                <Star className="h-3 w-3 fill-current" />
              </>
            )}
          </button>
        ))}
      </div>
    </div>

    {/* Price Range */}
    <div>
      <label className="text-sm font-medium mb-2 block">
        Price Range: ${priceRange[0]} - ${priceRange[1]}/hr
      </label>
      <Slider
        value={priceRange}
        onValueChange={setPriceRange}
        min={0}
        max={150}
        step={5}
        className="mt-4"
      />
      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>$0</span>
        <span>$150+</span>
      </div>
    </div>

    {/* Clear Filters */}
    {hasActiveFilters && (
      <Button variant="outline" className="w-full" onClick={clearFilters}>
        <X className="h-4 w-4 mr-2" />
        Clear All Filters
      </Button>
    )}
  </div>
);

// Add Service Form Component
interface AddServiceFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddServiceForm = ({ onClose, onSuccess }: AddServiceFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await servicesApi.createService({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
      });

      toast({
        title: "Success",
        description: "Service added successfully!",
      });
      
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add service.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Service Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Professional Plumbing Services"
        />
      </div>
      
      <div>
        <Label htmlFor="category">Category</Label>
        <Select 
          value={formData.category} 
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {serviceTypes.filter(s => s !== "All Services").map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="price">Price per Hour ($)</Label>
        <Input
          id="price"
          type="number"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          placeholder="e.g., 75"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your service..."
          rows={4}
        />
      </div>
      
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            "Add Service"
          )}
        </Button>
      </div>
    </form>
  );
};

export default function Providers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState(searchParams.get("category") || "All Services");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 150]);
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<string[]>(["All Services"]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Handle category from URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedService(categoryParam);
    }
  }, [searchParams]);

  // Update URL when service filter changes
  useEffect(() => {
    if (selectedService && selectedService !== "All Services") {
      setSearchParams({ category: selectedService });
    } else {
      setSearchParams({});
    }
  }, [selectedService, setSearchParams]);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const { services } = await servicesApi.getServices();
      
      // Transform services to provider format
      const transformedProviders: Provider[] = services.map((service) => ({
        id: service._id,
        name: service.title,
        ownerName: service.provider?.name || "Unknown Provider",
        avatar: "",
        serviceType: service.category,
        location: "Los Angeles, CA", // Default location since not in service model
        rating: service.rating || 4.5,
        totalReviews: service.reviewCount || 0,
        completedJobs: Math.floor(Math.random() * 200) + 50,
        pricePerHour: service.price,
        isVerified: true,
        responseTime: "Within 2 hours",
        badges: ["Professional"],
        description: service.description,
      }));
      
      setProviders(transformedProviders);
      
      // Extract unique categories
      const uniqueCategories = ["All Services", ...new Set(services.map((s) => s.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Cannot connect to backend. Make sure your server is running.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredProviders = useMemo(() => {
    let result = providers.filter((provider) => {
      const matchesSearch =
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.serviceType.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesService =
        selectedService === "All Services" || provider.serviceType === selectedService;
      
      const matchesLocation =
        selectedLocation === "All Locations" || provider.location === selectedLocation;
      
      const matchesRating = provider.rating >= minRating;
      
      const matchesPrice =
        provider.pricePerHour >= priceRange[0] && provider.pricePerHour <= priceRange[1];

      return matchesSearch && matchesService && matchesLocation && matchesRating && matchesPrice;
    });

    // Sort results
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        result.sort((a, b) => b.totalReviews - a.totalReviews);
        break;
      case "price-low":
        result.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case "price-high":
        result.sort((a, b) => b.pricePerHour - a.pricePerHour);
        break;
      case "jobs":
        result.sort((a, b) => b.completedJobs - a.completedJobs);
        break;
    }

    return result;
  }, [providers, searchQuery, selectedService, selectedLocation, minRating, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedService("All Services");
    setSelectedLocation("All Locations");
    setMinRating(0);
    setPriceRange([0, 150]);
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedService !== "All Services" ||
    selectedLocation !== "All Locations" ||
    minRating > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 150;

  const filterProps = {
    selectedService,
    setSelectedService,
    selectedLocation,
    setSelectedLocation,
    minRating,
    setMinRating,
    priceRange,
    setPriceRange,
    hasActiveFilters,
    clearFilters,
    categories,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-gradient py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary-foreground mb-4 animate-fade-up">
                Find Service Providers
              </h1>
              <p className="text-primary-foreground/80 text-lg mb-8 animate-fade-up delay-100">
                Connect with verified professionals in your area
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto animate-fade-up delay-200">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search providers by name or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-base rounded-xl bg-card border-none shadow-lg"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Category Quick Filters */}
        <section className="py-6 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedService(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedService === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Desktop Filters Sidebar */}
              <aside className="hidden lg:block w-72 flex-shrink-0">
                <Card className="sticky top-4">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-heading font-semibold flex items-center gap-2">
                        <SlidersHorizontal className="h-5 w-5" />
                        Filters
                      </h2>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="text-sm text-primary hover:underline"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <FilterContent {...filterProps} />
                  </CardContent>
                </Card>
              </aside>

              {/* Results Section */}
              <div className="flex-1">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{filteredProviders.length}</span>{" "}
                      providers found
                      {selectedService !== "All Services" && (
                        <span className="ml-1">
                          in <span className="text-primary font-medium">{selectedService}</span>
                        </span>
                      )}
                    </p>
                    
                    {/* Mobile Filter Button */}
                    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="lg:hidden">
                          <Filter className="h-4 w-4 mr-2" />
                          Filters
                          {hasActiveFilters && (
                            <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                              !
                            </Badge>
                          )}
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-80">
                        <SheetHeader>
                          <SheetTitle>Filters</SheetTitle>
                          <SheetDescription>
                            Narrow down your search results
                          </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6">
                          <FilterContent {...filterProps} />
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Add Service Button (for providers) */}
                    {user?.role === "provider" && (
                      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Service
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Service</DialogTitle>
                            <DialogDescription>
                              Create a new service listing for customers to find.
                            </DialogDescription>
                          </DialogHeader>
                          <AddServiceForm 
                            onClose={() => setIsAddDialogOpen(false)} 
                            onSuccess={fetchServices}
                          />
                        </DialogContent>
                      </Dialog>
                    )}

                    {/* Sort */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-44 bg-background">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border z-50">
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* View Toggle */}
                    <div className="hidden md:flex items-center gap-1 bg-muted rounded-lg p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === "grid"
                            ? "bg-background shadow-sm"
                            : "hover:bg-background/50"
                        }`}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === "list"
                            ? "bg-background shadow-sm"
                            : "hover:bg-background/50"
                        }`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedService !== "All Services" && (
                      <Badge variant="secondary" className="gap-1">
                        {selectedService}
                        <button onClick={() => setSelectedService("All Services")}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {selectedLocation !== "All Locations" && (
                      <Badge variant="secondary" className="gap-1">
                        {selectedLocation}
                        <button onClick={() => setSelectedLocation("All Locations")}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {minRating > 0 && (
                      <Badge variant="secondary" className="gap-1">
                        {minRating}+ stars
                        <button onClick={() => setMinRating(0)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {(priceRange[0] > 0 || priceRange[1] < 150) && (
                      <Badge variant="secondary" className="gap-1">
                        ${priceRange[0]} - ${priceRange[1]}/hr
                        <button onClick={() => setPriceRange([0, 150])}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                )}

                {/* Results */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : filteredProviders.length > 0 ? (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                        : "space-y-4"
                    }
                  >
                    {filteredProviders.map((provider) => (
                      <ProviderCard
                        key={provider.id}
                        provider={provider}
                        isListView={viewMode === "list"}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold mb-2">
                      No providers found
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your filters or search query.
                    </p>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
