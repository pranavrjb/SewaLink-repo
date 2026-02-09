import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Star, ArrowRight, Filter, X, Loader2 } from "lucide-react";
import { servicesApi, Service as ApiService } from "@/services/servicesApi";
import { useToast } from "@/hooks/use-toast";

// Import fallback images
import plumbingImg from "@/assets/plumbing.jpg";
import electricalImg from "@/assets/electrical.jpg";
import cleaningImg from "@/assets/cleaning.jpg";
import carpentryImg from "@/assets/carpentry.jpg";
import paintingImg from "@/assets/painting.jpg";
import hvacImg from "@/assets/hvac.jpg";
import gardeningImg from "@/assets/gardening.jpg";
import pestcontrolImg from "@/assets/pestcontrol.jpg";
import applianceImg from "@/assets/appliance.jpg";
import healthcareImg from "@/assets/healthcare.jpg";
import beautyImg from "@/assets/beauty.jpg";
import educationImg from "@/assets/education.jpg";
import it_supportImg from "@/assets/it_support.jpg";
import securityImg from "@/assets/security.jpg";
import movingImg from "@/assets/moving.jpg";
import petcareImg from "@/assets/petcare.jpg";
import fitnessImg from "@/assets/fitness.jpg";
import cateringImg from "@/assets/catering.jpg";
import laundryImg from "@/assets/laundry.jpg";

// Map categories to fallback images
const categoryImages: Record<string, string> = {
  plumbing: plumbingImg,
  electrical: electricalImg,
  cleaning: cleaningImg,
  carpentry: carpentryImg,
  painting: paintingImg,
  hvac: hvacImg,
  gardening: gardeningImg,
  pest_control: pestcontrolImg,
  appliance: applianceImg,
    healthcare: healthcareImg,
  doctor: healthcareImg,
  beauty: beautyImg,
  salon: beautyImg,
  spa: beautyImg,
  education: educationImg,
  tutor: educationImg,
  tutoring: educationImg,
  it_support: it_supportImg,
  it: it_supportImg,
  tech: it_supportImg,
  security: securityImg,
  moving: movingImg,
  relocation: movingImg,
  petcare: petcareImg,
  pet_care: petcareImg,
  veterinary: petcareImg,
  fitness: fitnessImg,
  gym: fitnessImg,
  yoga: fitnessImg,
  catering: cateringImg,
  cooking: cateringImg,
  chef: cateringImg,
  laundry: laundryImg,
  dry_cleaning: laundryImg,
};

const getServiceImage = (service: ApiService): string => {
  if (service.image) return service.image;
  const categoryKey = service.category.toLowerCase().replace(/\s+/g, "_");
  return categoryImages[categoryKey] || plumbingImg;
};

interface DisplayService {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
}

interface ServiceCardProps {
  service: DisplayService;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-card card-hover animate-fade-up">
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
          From Rs.{service.price}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
            {service.category}
          </span>
          {/* <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-sm font-medium text-foreground">{service.rating}</span>
            <span className="text-sm text-muted-foreground">({service.reviews})</span>
          </div> */}
        </div>
        <h3 className="text-lg font-heading font-semibold text-card-foreground mb-2">
          {service.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {service.description}
        </p>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate(`/providers?category=${encodeURIComponent(service.category)}`)}
        >
          Book Now
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

const Services = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [services, setServices] = useState<DisplayService[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const { services: apiServices } = await servicesApi.getServices();
        
        const displayServices: DisplayService[] = apiServices.map((s) => ({
          id: s._id,
          title: s.title,
          description: s.description,
          image: getServiceImage(s),
          price: s.price,
          rating: s.rating || 4.5,
          reviews: s.reviewCount || 0,
          category: s.category,
        }));
        
        setServices(displayServices);
        
        // Extract unique categories
        const uniqueCategories = ["All", ...new Set(apiServices.map((s) => s.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        toast({
          title: "Connection Error",
          description: "Cannot connect to backend. Make sure your server is running at localhost:5000 and you're viewing this locally, not in Lovable's preview.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [toast]);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [services, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-gradient py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary-foreground mb-4 animate-fade-up">
              Find the Perfect Service
            </h1>
            <p className="text-primary-foreground/80 text-lg mb-8 animate-fade-up delay-100">
              Browse our wide range of professional home services
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto animate-fade-up delay-200">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for services..."
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

      {/* Main Content */}
      <section className="py-12">
        <div className="container">
          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors md:hidden"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Results Count */}
          <p className="text-muted-foreground mb-6">
            Showing <span className="font-semibold text-foreground">{filteredServices.length}</span>{" "}
            {filteredServices.length === 1 ? "service" : "services"}
            {selectedCategory !== "All" && (
              <span>
                {" "}
                in <span className="font-semibold text-primary">{selectedCategory}</span>
              </span>
            )}
            {searchQuery && (
              <span>
                {" "}
                for "<span className="font-semibold text-foreground">{searchQuery}</span>"
              </span>
            )}
          </p>

          {/* Services Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                No services found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
