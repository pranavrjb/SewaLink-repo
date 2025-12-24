import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Eye, EyeOff, Mail, Lock, User, Phone, Loader2, CheckCircle } from "lucide-react";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email is too long"),
  phone: z.string().trim().min(10, "Please enter a valid phone number").max(15, "Phone number is too long"),
  password: z.string().min(6, "Password must be at least 6 characters").max(128, "Password is too long"),
  role: z.enum(["user", "provider"], { required_error: "Please select a role" }),
});

type FormData = z.infer<typeof registerSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

const Register = () => {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    // Validate input
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role as "user" | "provider",
      });
      setSuccess(response.message || "Registration successful! Please check your email to verify your account." );
      toast({
        title: "Registration Successful!",
        description:"Please check your email to verify your account before logging in.",
      });
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
      toast({
        title: "Registration Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-card p-8 animate-fade-up">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-heading font-bold text-card-foreground mb-2">
                Create Account
              </h1>
              <p className="text-muted-foreground">
                Join SewaLink today
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <p className="text-sm text-primary">{success}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={`pl-10 ${errors.name ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">I want to</Label>
                <Select
                  value={form.role}
                  onValueChange={(value) => handleChange("role", value)}
                >
                  <SelectTrigger className={errors.role ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">
                      <div className="flex flex-col">
                        <span>Book Services</span>
                        <span className="text-xs text-muted-foreground">I need help with home services</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="provider">
                      <div className="flex flex-col">
                        <span>Provide Services</span>
                        <span className="text-xs text-muted-foreground">I'm a service professional</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-destructive">{errors.role}</p>
                )}
              </div>

              {/* Terms */}
              <p className="text-xs text-muted-foreground text-center">
                By creating an account, you agree to our{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg" disabled={isLoading || !!success}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <Button
              variant="outline"
              className="w-full"
              size="lg"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;