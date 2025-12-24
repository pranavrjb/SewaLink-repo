import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, DollarSign, Clock, Users, Star, Shield, TrendingUp, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BecomeProvider = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: DollarSign,
      title: "Earn More",
      description: "Set your own rates and keep more of what you earn with our competitive commission structure."
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Work when you want. Accept jobs that fit your schedule and availability."
    },
    {
      icon: Users,
      title: "Grow Your Client Base",
      description: "Get access to thousands of customers looking for your services in your area."
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Get paid on time, every time. We handle payments so you can focus on your work."
    },
    {
      icon: Star,
      title: "Build Your Reputation",
      description: "Showcase your skills and collect reviews to stand out from the competition."
    },
    {
      icon: TrendingUp,
      title: "Business Tools",
      description: "Access powerful tools to manage bookings, track earnings, and grow your business."
    }
  ];

  const steps = [
    {
      step: 1,
      title: "Create Your Profile",
      description: "Sign up and complete your professional profile with your skills, experience, and service areas."
    },
    {
      step: 2,
      title: "Get Verified",
      description: "Submit required documents for verification. We ensure all providers meet our quality standards."
    },
    {
      step: 3,
      title: "Start Accepting Jobs",
      description: "Once approved, you'll start receiving job requests from customers in your area."
    },
    {
      step: 4,
      title: "Get Paid",
      description: "Complete jobs, collect reviews, and receive payments directly to your account."
    }
  ];

  const requirements = [
    "Valid government-issued ID",
    "Proof of relevant skills or certifications",
    "Clean background check",
    "Professional tools and equipment",
    "Smartphone with internet access",
    "Commitment to quality service"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Briefcase className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Join Our Network</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
            Become a <span className="text-primary">SewaLink</span> Provider
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Turn your skills into income. Join thousands of service professionals earning on their own terms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/register")}>
              Apply Now
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/services")}>
              View Services
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Why Join SewaLink?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide everything you need to succeed as a service provider.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Getting started is easy. Follow these simple steps to become a provider.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                Requirements
              </h2>
              <p className="text-lg text-muted-foreground">
                To ensure quality service, all providers must meet the following criteria.
              </p>
            </div>
            
            <Card className="border-border">
              <CardContent className="p-8">
                <ul className="space-y-4">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Join thousands of service providers already earning with SewaLink. 
            Apply today and start growing your business.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate("/register")}
          >
            Apply Now
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BecomeProvider;
