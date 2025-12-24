import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Briefcase, Heart, Zap, Users, Globe, ArrowRight } from "lucide-react";

const Careers = () => {
  const perks = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health, dental, and vision coverage for you and your family."
    },
    {
      icon: Zap,
      title: "Flexible Work",
      description: "Remote-first culture with flexible hours to maintain work-life balance."
    },
    {
      icon: Users,
      title: "Great Team",
      description: "Work with talented, passionate people who care about making a difference."
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Help connect millions of people with trusted service providers worldwide."
    }
  ];

  const openings = [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Build beautiful, performant user interfaces that millions of users love."
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "New York, NY",
      type: "Full-time",
      description: "Drive product strategy and work with cross-functional teams to deliver features."
    },
    {
      title: "UX Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Create intuitive experiences that delight both customers and service providers."
    },
    {
      title: "Customer Success Manager",
      department: "Operations",
      location: "San Francisco, CA",
      type: "Full-time",
      description: "Help service providers succeed and grow their businesses on our platform."
    },
    {
      title: "Data Analyst",
      department: "Analytics",
      location: "Remote",
      type: "Full-time",
      description: "Turn data into insights that drive business decisions and improve user experience."
    },
    {
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Contract",
      description: "Create compelling campaigns that attract customers and providers to our platform."
    }
  ];

  const values = [
    {
      title: "Customer First",
      description: "We obsess over our customers' success and always put their needs first."
    },
    {
      title: "Move Fast",
      description: "We ship quickly, learn from feedback, and iterate to improve constantly."
    },
    {
      title: "Be Transparent",
      description: "We communicate openly and honestly with each other and our users."
    },
    {
      title: "Own It",
      description: "We take responsibility for our work and its impact on the business."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
            Join Our <span className="text-primary">Mission</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Help us connect communities with trusted service providers. 
            We're building something special and we want you to be part of it.
          </p>
          <Button size="lg" onClick={() => document.getElementById('openings')?.scrollIntoView({ behavior: 'smooth' })}>
            View Open Positions
          </Button>
        </div>
      </section>

      {/* Perks Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Why Work at SewaLink?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We believe in taking care of our team so they can do their best work.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {perks.map((perk, index) => (
              <Card key={index} className="border-border text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <perk.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                    {perk.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {perk.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide how we work together and build our product.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Open Positions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find your next opportunity. We're always looking for talented people to join our team.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {openings.map((job, index) => (
              <Card key={index} className="border-border hover:border-primary/50 transition-colors cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        <Badge variant="secondary">{job.department}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" className="gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Apply
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">
            Don't See Your Role?
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            We're always interested in meeting talented people. 
            Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <Button size="lg" variant="secondary">
            Send Your Resume
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Careers;
