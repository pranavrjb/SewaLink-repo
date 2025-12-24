import { Shield, Clock, Star, CreditCard, Headphones, CheckCircle } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  return (
    <div className={`group bg-card p-6 rounded-2xl shadow-card card-hover animate-fade-up ${delay}`}>
      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:bg-primary">
        <div className="text-primary group-hover:text-primary-foreground transition-colors">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-heading font-semibold text-card-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
};

const WhyChooseUs = () => {
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Verified Professionals",
      description: "All service providers are background-checked and verified for your safety.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Instant Booking",
      description: "Book services in seconds and get confirmation instantly on your phone.",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Quality Guaranteed",
      description: "Not satisfied? We'll make it right or refund your payment. No questions asked.",
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Secure Payments",
      description: "Pay securely through our platform with multiple payment options available.",
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Our support team is always here to help you with any questions or concerns.",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Fair Pricing",
      description: "Transparent pricing with no hidden fees. Know exactly what you'll pay upfront.",
    },
  ];

  return (
    <section className="py-20 bg-secondary/50">
      <div className="container">
        <div className="text-center mb-12">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-2 animate-fade-up">
            Why SewaLink?
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4 animate-fade-up delay-100">
            Why Choose Us
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto animate-fade-up delay-200">
            We're committed to making home services simple, safe, and satisfying for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              delay={`delay-${(index + 1) * 100}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
