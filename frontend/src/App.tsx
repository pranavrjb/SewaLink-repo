import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute, GuestRoute } from "@/components/auth";
import {Cloudinary} from "@cloudinary/url-gen";
import {AdvancedImage} from '@cloudinary/react';
import {fill} from "@cloudinary/url-gen/actions/resize";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProviderProfile from "./pages/ProviderProfile";
import Providers from "./pages/Providers";
import MyBookings from "./pages/MyBookings";
import ProviderBookings from "./pages/ProviderBookings";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import HelpCenter from "./pages/HelpCenter";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import BecomeProvider from "./pages/BecomeProvider";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Unauthorized from "./pages/Unauthorized";
import { UserManagement, ServiceManagement } from "./pages/admin";
import NotFound from "./pages/NotFound";
import Reviews from "./pages/Reviews";

const queryClient = new QueryClient();
const cld = new Cloudinary({
    cloud: {
      cloudName: 'sewalink'
    }
  });
  // Instantiate a CloudinaryImage object for the image with the public ID, 'docs/models'.
  const myImage = cld.image('docs/models'); 

  // Resize to 250 x 250 pixels using the 'fill' crop mode.
  myImage.resize(fill().width(250).height(250));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
         {/* <AdvancedImage cldImg={myImage} /> */}
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/providers" element={<Providers />} />
            <Route path="/provider/:id" element={<ProviderProfile />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/become-provider" element={<BecomeProvider />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/reviews" element={<Reviews />} />

            {/* Guest only routes (redirect if authenticated) */}
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

            {/* Protected routes - any authenticated user */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Protected routes - users only */}
            <Route path="/my-bookings" element={<ProtectedRoute allowedRoles={["user"]}><MyBookings /></ProtectedRoute>} />

            {/* Protected routes - providers only */}
            <Route path="/provider-bookings" element={<ProtectedRoute allowedRoles={["provider"]}><ProviderBookings /></ProtectedRoute>} />

            {/* Unauthorized page */}
            <Route path="/unauthorized" element={<Unauthorized />} />

             {/* Protected routes - admin only */}
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><UserManagement /></ProtectedRoute>} />
            <Route path="/admin/services" element={<ProtectedRoute allowedRoles={["admin"]}><ServiceManagement /></ProtectedRoute>} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
