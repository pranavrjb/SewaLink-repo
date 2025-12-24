import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="SewaLink professionals"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50" />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-40 left-10 w-48 h-48 bg-primary-foreground/10 rounded-full blur-3xl animate-float delay-300" />

      {/* Content */}
      <div className="container relative z-10 py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-up">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-primary-foreground/90 text-sm font-medium">
              Trusted by 10,000+ households
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-foreground leading-tight mb-6 animate-fade-up delay-100">
            Your Community,{" "}
            <span className="text-accent">Your Helpers</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl animate-fade-up delay-200">
            SewaLink connects you with verified local professionals for all your
            home service needs. Book instantly, pay securely, and relax.
          </p>

          <div className="flex flex-wrap gap-4 animate-fade-up delay-300">
            <Button variant="hero" onClick={() => navigate("/services")}>
              Explore Services
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="hero-outline" onClick={() => navigate("/become-provider")}>
              Become a Provider
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-primary-foreground/20 animate-fade-up delay-400">
            <div>
              <p className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground">500+</p>
              <p className="text-primary-foreground/70 text-sm">Service Providers</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground">15K+</p>
              <p className="text-primary-foreground/70 text-sm">Happy Customers</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground">4.9</p>
              <p className="text-primary-foreground/70 text-sm">Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
