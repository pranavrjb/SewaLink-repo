import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserDashboard from "@/components/dashboard/UserDashboard";
import ProviderDashboard from "@/components/dashboard/ProviderDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case "admin":
        return <AdminDashboard user={user} />;
      case "provider":
        return <ProviderDashboard user={user} />;
      case "user":
      default:
        return <UserDashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        {renderDashboard()}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
