import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Target, Heart, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                About <span className="text-gradient">SewaLink</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                We're on a mission to connect communities with trusted service providers, 
                making quality home services accessible to everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-heading font-bold mb-6 text-center">Our Story</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="mb-4">
                  SewaLink was founded with a simple yet powerful vision: to bridge the gap between 
                  skilled service providers and the communities that need them. We recognized that 
                  finding reliable, trustworthy professionals for home services was often a challenge 
                  filled with uncertainty.
                </p>
                <p className="mb-4">
                  Our platform was built to solve this problem by creating a transparent, efficient, 
                  and secure marketplace where service providers can showcase their skills and 
                  customers can find the help they need with confidence.
                </p>
                <p>
                  Today, SewaLink serves thousands of customers and providers, facilitating 
                  connections that make homes better and lives easier.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-heading font-bold mb-12 text-center">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-card p-6 rounded-xl shadow-sm text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-2">Community First</h3>
                <p className="text-sm text-muted-foreground">
                  We prioritize the needs of our community and build lasting relationships.
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-sm text-center">
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-heading font-semibold mb-2">Excellence</h3>
                <p className="text-sm text-muted-foreground">
                  We strive for excellence in every service and interaction.
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-sm text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-2">Trust</h3>
                <p className="text-sm text-muted-foreground">
                  We build trust through transparency, reliability, and integrity.
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-sm text-center">
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-heading font-semibold mb-2">Quality</h3>
                <p className="text-sm text-muted-foreground">
                  We ensure quality by vetting providers and maintaining high standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-heading font-bold mb-6">Join Our Journey</h2>
              <p className="text-muted-foreground mb-8">
                Whether you're a skilled professional looking to grow your business or a 
                homeowner seeking reliable services, SewaLink is here for you.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
