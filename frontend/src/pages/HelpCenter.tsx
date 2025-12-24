import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, MessageCircle, Phone, Mail, FileText, Users, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const helpCategories = [
  {
    icon: BookOpen,
    title: "Getting Started",
    description: "Learn the basics of using SewaLink",
    links: ["Create an account", "Book your first service", "Find providers near you"]
  },
  {
    icon: Users,
    title: "For Service Providers",
    description: "Resources for service professionals",
    links: ["Register as a provider", "Manage your listings", "Handle bookings"]
  },
  {
    icon: CreditCard,
    title: "Payments & Billing",
    description: "Payment methods and billing help",
    links: ["Payment options", "Refund policy", "Invoice questions"]
  },
  {
    icon: FileText,
    title: "Bookings & Services",
    description: "Manage your service bookings",
    links: ["Modify bookings", "Cancel a service", "Service guarantees"]
  }
];

const HelpCenter = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                How can we <span className="text-gradient">help you?</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Search our knowledge base or browse categories below
              </p>
              <div className="flex max-w-xl mx-auto gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    placeholder="Search for help..." 
                    className="pl-10 h-12"
                  />
                </div>
                <Button className="h-12 px-6">Search</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Help Categories */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-2xl font-heading font-bold mb-8 text-center">Browse by Category</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {helpCategories.map((category, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                      <category.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="font-heading text-lg">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a href="#" className="text-sm text-primary hover:underline">
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Options */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-2xl font-heading font-bold mb-8 text-center">Need More Help?</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">Live Chat</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Chat with our support team in real-time
                  </p>
                  <Button variant="outline" className="w-full">Start Chat</Button>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">Email Support</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get help via email within 24 hours
                  </p>
                  <Button variant="outline" className="w-full">Send Email</Button>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">Phone Support</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Call us Mon-Fri, 9am-6pm
                  </p>
                  <Button variant="outline" className="w-full">Call Now</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Link */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-heading font-bold mb-4">Check our FAQ</h2>
              <p className="text-muted-foreground mb-6">
                Find quick answers to commonly asked questions
              </p>
              <Link to="/faq">
                <Button>View FAQ</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCenter;
