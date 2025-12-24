import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <ShieldX className="mx-auto h-16 w-16 text-destructive mb-4" />
          <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access this page.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Unauthorized;
