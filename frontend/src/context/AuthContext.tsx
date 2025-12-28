import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api, isAxiosError } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "provider" | "admin";
  token: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<{ message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "user" | "provider";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("sewalink_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("sewalink_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      
      const userData: User = {
        id: data.user?.id || data.id,
        name: data.user?.name || data.name,
        email: data.user?.email || data.email,
        phone: data.user?.phone || data.phone,
        role: data.user?.role || data.role || "user",
        token: data.token,
      };

      setUser(userData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("sewalink_user", JSON.stringify(userData));
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Login failed");
      }
      throw new Error("Login failed");
    }
  };

  const register = async (data: RegisterData): Promise<{ message: string }> => {
    try {
      const { data: result } = await api.post("/auth/register", data);
      return { message: result.message || "Registration successful!" };
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Registration failed");
      }
      throw new Error("Registration failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sewalink_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
