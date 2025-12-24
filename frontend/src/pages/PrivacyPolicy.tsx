import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                Privacy <span className="text-gradient">Policy</span>
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
                  <h2 className="text-2xl font-heading font-bold mb-4">1. Introduction</h2>
                  <p className="text-muted-foreground">
                    SewaLink ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                    explains how we collect, use, disclose, and safeguard your information when you use our 
                    platform and services.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">2. Information We Collect</h2>
                  <p className="text-muted-foreground mb-4">We collect information that you provide directly to us, including:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Name, email address, phone number, and address</li>
                    <li>Account credentials and profile information</li>
                    <li>Payment information and transaction history</li>
                    <li>Communications with service providers and support</li>
                    <li>Reviews, ratings, and feedback you provide</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">3. How We Use Your Information</h2>
                  <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and send related information</li>
                    <li>Connect you with service providers</li>
                    <li>Send promotional communications (with your consent)</li>
                    <li>Respond to your comments and questions</li>
                    <li>Detect and prevent fraudulent activities</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">4. Information Sharing</h2>
                  <p className="text-muted-foreground">
                    We may share your information with service providers to facilitate bookings, with third-party 
                    service providers who assist in our operations, and as required by law. We do not sell your 
                    personal information to third parties.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">5. Data Security</h2>
                  <p className="text-muted-foreground">
                    We implement appropriate technical and organizational measures to protect your personal 
                    information against unauthorized access, alteration, disclosure, or destruction. However, 
                    no method of transmission over the Internet is 100% secure.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">6. Your Rights</h2>
                  <p className="text-muted-foreground mb-4">You have the right to:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Access and receive a copy of your personal data</li>
                    <li>Correct inaccurate or incomplete information</li>
                    <li>Request deletion of your personal data</li>
                    <li>Object to or restrict processing of your data</li>
                    <li>Withdraw consent at any time</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">7. Cookies</h2>
                  <p className="text-muted-foreground">
                    We use cookies and similar tracking technologies to track activity on our platform and 
                    hold certain information. You can instruct your browser to refuse all cookies or to 
                    indicate when a cookie is being sent.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">8. Children's Privacy</h2>
                  <p className="text-muted-foreground">
                    Our services are not intended for individuals under the age of 18. We do not knowingly 
                    collect personal information from children under 18.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">9. Changes to This Policy</h2>
                  <p className="text-muted-foreground">
                    We may update our Privacy Policy from time to time. We will notify you of any changes 
                    by posting the new Privacy Policy on this page and updating the "Last updated" date.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">10. Contact Us</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about this Privacy Policy, please contact us at:
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Email: privacy@sewalink.com<br />
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

export default PrivacyPolicy;
