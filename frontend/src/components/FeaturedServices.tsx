import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import plumbingImg from "@/assets/plumbing.jpg";
import electricalImg from "@/assets/electrical.jpg";
import cleaningImg from "@/assets/cleaning.jpg";

interface ServiceCardProps {
  title: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  delay: string;
}

const ServiceCard = ({ title, image, price, rating, reviews, delay }: ServiceCardProps) => {
  const navigate = useNavigate();

  return (
    <div className={`group bg-card rounded-2xl overflow-hidden shadow-card card-hover animate-fade-up ${delay}`}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
          From ${price}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-accent text-accent" />
          <span className="text-sm font-medium text-foreground">{rating}</span>
          <span className="text-sm text-muted-foreground">({reviews} reviews)</span>
        </div>
        <h3 className="text-xl font-heading font-semibold text-card-foreground mb-3">{title}</h3>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate("/services")}
        >
          Book Now
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

const FeaturedServices = () => {
  const services = [
    { id: 1, title: "Plumbing Services", image: plumbingImg, price: 50, rating: 4.9, reviews: 234 },
    { id: 2, title: "Electrical Work", image: electricalImg, price: 60, rating: 4.8, reviews: 189 },
    { id: 3, title: "House Cleaning", image: cleaningImg, price: 40, rating: 4.9, reviews: 312 },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-2 animate-fade-up">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4 animate-fade-up delay-100">
            Featured Services
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto animate-fade-up delay-200">
            Choose from our most popular home services, delivered by verified professionals
            in your community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              {...service}
              delay={`delay-${(index + 1) * 100}`}
            />
          ))}
        </div>

        <div className="text-center mt-12 animate-fade-up delay-400">
          <Button size="lg" onClick={() => {}}>
            View All Services
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
