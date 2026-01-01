import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 hero-gradient relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-primary-foreground/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-accent/20 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4 animate-fade-up">
            Ready to Get Started?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 animate-fade-up delay-100">
            Join thousands of happy customers who trust SewaLink for all their home service needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-up delay-200">
            <Button variant="hero" >
              Book a Service Now
              <ArrowRight className="w-5 h-5" />
            </Button>
            {/* <Button variant="hero-outline">
              Download the App
            </Button> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
