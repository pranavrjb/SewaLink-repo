import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does SewaLink work?",
    answer: "SewaLink connects you with verified service providers in your area. Simply browse our services, select a provider, and book an appointment. Our platform handles scheduling, payments, and reviews to ensure a seamless experience."
  },
  {
    question: "How are service providers vetted?",
    answer: "All service providers on SewaLink undergo a thorough verification process including background checks, skill assessments, and document verification. We also monitor reviews and ratings to maintain quality standards."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards, digital wallets, and bank transfers. All payments are processed securely through our encrypted payment gateway."
  },
  {
    question: "Can I cancel or reschedule a booking?",
    answer: "Yes, you can cancel or reschedule bookings up to 24 hours before the scheduled service time without any charges. Cancellations within 24 hours may incur a fee depending on the service provider's policy."
  },
  {
    question: "How do I become a service provider?",
    answer: "To become a service provider, click on 'Become a Provider' and complete the registration process. You'll need to submit your professional credentials, undergo verification, and set up your service offerings."
  },
  {
    question: "What if I'm not satisfied with the service?",
    answer: "Your satisfaction is our priority. If you're not happy with a service, contact our support team within 48 hours. We'll work with you and the provider to resolve the issue or provide a refund where applicable."
  },
  {
    question: "Are prices fixed or can I negotiate?",
    answer: "Prices are set by individual service providers. While listed prices are standard, some providers may offer custom quotes for specific jobs. You can discuss pricing directly through our messaging feature."
  },
  {
    question: "How do reviews and ratings work?",
    answer: "After each completed service, both customers and providers can leave reviews and ratings. This helps maintain quality and helps other users make informed decisions. Reviews are verified to ensure authenticity."
  },
  {
    question: "Is my personal information secure?",
    answer: "Yes, we take data security seriously. All personal information is encrypted and stored securely. We never share your data with third parties without your consent. Read our Privacy Policy for more details."
  },
  {
    question: "What areas do you serve?",
    answer: "SewaLink is available in multiple cities and is continuously expanding. Enter your location on our platform to see available services in your area."
  }
];

const FAQ = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                Frequently Asked <span className="text-gradient">Questions</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Find answers to common questions about SewaLink services.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="bg-card rounded-lg px-6 border shadow-sm"
                  >
                    <AccordionTrigger className="text-left font-heading font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-heading font-bold mb-4">Still have questions?</h2>
              <p className="text-muted-foreground mb-6">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <a 
                href="/help" 
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
