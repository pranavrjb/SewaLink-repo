import { api, isAxiosError } from "@/lib/api";

export interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image?: string;
  phone?: string;
  location?: string;

  provider: {
    _id: string;
    name: string;
    email: string;
  };

  rating?: number;
  reviewCount?: number;
  isHidden?: boolean;

  createdAt: string;
  updatedAt: string;
}


interface ServicesResponse {
  services: Service[];
}

export const servicesApi = {
  // GET all services
  getServices: async (): Promise<ServicesResponse> => {
    try {
      const { data } = await api.get("/services");
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch services");
      }
      throw new Error("Failed to fetch services");
    }
  },

  // GET service by ID
  getServiceById: async (id: string): Promise<{ service: Service }> => {
    try {
      const { data } = await api.get(`/services/${id}`);
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch service");
      }
      throw new Error("Failed to fetch service");
    }
  },

  // CREATE service (provider only)
  createService: async (serviceData: {
    title: string;
    description: string;
    category: string;
    price: number;
    phone: string;
    location: string;
  }) => {
    try {
      const { data } = await api.post("/services/add", serviceData);
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to create service");
      }
      throw new Error("Failed to create service");
    }
  },

  // DELETE service
  deleteService: async (id: string) => {
    try {
      const { data } = await api.delete(`/services/${id}`);
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to delete service");
      }
      throw new Error("Failed to delete service");
    }
  },

  // UPDATE service (provider only)
  updateService: async (id: string, serviceData: Partial<{
    title: string;
    description: string;
    category: string;
    price: number;
    phone: string;
    location: string;
    isHidden: boolean;
  }>) => {
    try {
      const { data } = await api.put(`/services/${id}`, serviceData);
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to update service");
      }
      throw new Error("Failed to update service");
    }
  },

  // GET provider profile with services, reviews, and stats
  getProviderProfile: async (id: string) => {
    try {
      // ✅ CORRECT ENDPOINT - Calls the backend route that returns reviews
      const { data } = await api.get(`/services/provider/${id}/profile`);
      return data; // { provider, services, reviews, stats }
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to get Provider Profile"
        );
      }
      throw new Error("Failed to get Provider Profile");
    }
  },

  // GET provider services
  getProviderServices: async (id: string) => {
    try {
      const { data } = await api.get(`/services/provider/${id}/profile`);
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to get Provider Services"
        );
      }
      throw new Error("Failed to get Provider Services");
    }
  },

};