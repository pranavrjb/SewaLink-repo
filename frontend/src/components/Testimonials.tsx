import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  delay: string;
}

const TestimonialCard = ({ name, role, content, rating, delay }: TestimonialCardProps) => {
  return (
    <div className={`bg-card p-6 rounded-2xl shadow-card animate-fade-up ${delay}`}>
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? "fill-accent text-accent" : "text-muted"}`}
          />
        ))}
      </div>
      <p className="text-foreground mb-6 leading-relaxed">"{content}"</p>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-primary font-semibold text-lg">{name.charAt(0)}</span>
        </div>
        <div>
          <p className="font-semibold text-card-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Homeowner",
      content: "SewaLink made finding a reliable plumber so easy! The professional arrived on time and fixed our issue quickly. Highly recommended!",
      rating: 5,
    },
    {
      name: "Rajesh Kumar",
      role: "Business Owner",
      content: "We use SewaLink for all our office cleaning needs. The service quality is consistently excellent and the pricing is very fair.",
      rating: 5,
    },
    {
      name: "Anita Patel",
      role: "Working Professional",
      content: "As a busy professional, I don't have time to search for service providers. SewaLink does it all for me. The app is so convenient!",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-2 animate-fade-up">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4 animate-fade-up delay-100">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto animate-fade-up delay-200">
            Don't just take our word for it – hear from our happy customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              {...testimonial}
              delay={`delay-${(index + 1) * 100}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
