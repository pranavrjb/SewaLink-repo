import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                Terms of <span className="text-gradient">Service</span>
              </h1>
              <p className="text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">1. Acceptance of Terms</h2>
                  <p className="text-muted-foreground">
                    By accessing or using SewaLink's platform and services, you agree to be bound by these 
                    Terms of Service. If you do not agree to these terms, please do not use our services.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">2. Description of Service</h2>
                  <p className="text-muted-foreground">
                    SewaLink provides a platform connecting customers with service providers for various 
                    home and professional services. We act as an intermediary and do not directly provide 
                    the services listed on our platform.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">3. User Accounts</h2>
                  <p className="text-muted-foreground mb-4">To use our services, you must:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Be at least 18 years old</li>
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Promptly update any changes to your information</li>
                    <li>Accept responsibility for all activities under your account</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">4. Service Provider Terms</h2>
                  <p className="text-muted-foreground mb-4">Service providers on our platform agree to:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Provide accurate information about their qualifications</li>
                    <li>Maintain all necessary licenses and certifications</li>
                    <li>Deliver services as described and agreed upon</li>
                    <li>Communicate professionally with customers</li>
                    <li>Comply with all applicable laws and regulations</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">5. Booking and Payments</h2>
                  <p className="text-muted-foreground">
                    All bookings made through SewaLink are subject to availability and confirmation. 
                    Payment terms, including pricing and refund policies, are displayed at the time of 
                    booking. We use secure payment processing and do not store your complete payment 
                    information.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">6. Cancellation Policy</h2>
                  <p className="text-muted-foreground">
                    Cancellations made more than 24 hours before the scheduled service are eligible for 
                    a full refund. Cancellations within 24 hours may be subject to a cancellation fee. 
                    Service providers may have their own cancellation policies which will be displayed 
                    during booking.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">7. User Conduct</h2>
                  <p className="text-muted-foreground mb-4">Users agree not to:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe on the rights of others</li>
                    <li>Submit false or misleading information</li>
                    <li>Interfere with the operation of the platform</li>
                    <li>Attempt to gain unauthorized access to systems</li>
                    <li>Use the platform for any unlawful purposes</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">8. Intellectual Property</h2>
                  <p className="text-muted-foreground">
                    All content on SewaLink, including text, graphics, logos, and software, is the 
                    property of SewaLink or its licensors and is protected by intellectual property 
                    laws. Users may not copy, modify, or distribute our content without permission.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">9. Limitation of Liability</h2>
                  <p className="text-muted-foreground">
                    SewaLink is not liable for any indirect, incidental, special, or consequential 
                    damages arising from your use of our services. Our total liability is limited to 
                    the amount you paid for the specific service in question.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">10. Indemnification</h2>
                  <p className="text-muted-foreground">
                    You agree to indemnify and hold SewaLink harmless from any claims, damages, or 
                    expenses arising from your use of the platform, violation of these terms, or 
                    infringement of any third-party rights.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">11. Dispute Resolution</h2>
                  <p className="text-muted-foreground">
                    Any disputes arising from these terms or your use of SewaLink shall be resolved 
                    through binding arbitration in accordance with applicable arbitration rules. 
                    You waive any right to participate in class action lawsuits.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">12. Changes to Terms</h2>
                  <p className="text-muted-foreground">
                    We reserve the right to modify these Terms of Service at any time. Changes will 
                    be effective upon posting to the platform. Your continued use of our services 
                    constitutes acceptance of the modified terms.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">13. Contact Information</h2>
                  <p className="text-muted-foreground">
                    For questions about these Terms of Service, please contact us at:
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Email: legal@sewalink.com<br />
                    Phone: +1 (555) 123-4567<br />
                    Address: 123 Service Street, Tech Hub, City 12345
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
