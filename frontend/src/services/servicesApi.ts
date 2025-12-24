import { api, isAxiosError } from "@/lib/api";

export interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image?: string;
  provider: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface ServicesResponse {
  services: Service[];
  total?: number;
  page?: number;
  limit?: number;
}

interface ServiceFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export const servicesApi = {
  // Get all services with optional filters
  getServices: async (filters?: ServiceFilters): Promise<ServicesResponse> => {
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append("category", filters.category);
      if (filters?.search) params.append("search", filters.search);
      if (filters?.minPrice) params.append("minPrice", filters.minPrice.toString());
      if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.limit) params.append("limit", filters.limit.toString());

      const { data } = await api.get(`/services?${params.toString()}`);
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch services");
      }
      throw new Error("Failed to fetch services");
    }
  },

  // Get a single service by ID
  getServiceById: async (serviceId: string): Promise<{ service: Service }> => {
    try {
      const { data } = await api.get(`/services/${serviceId}`);
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch service");
      }
      throw new Error("Failed to fetch service");
    }
  },

  // Get services by provider
  getProviderServices: async (providerId: string): Promise<ServicesResponse> => {
    try {
      const { data } = await api.get(`/services/provider/${providerId}`);
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch provider services");
      }
      throw new Error("Failed to fetch provider services");
    }
  },

  // Get services by category
  getServicesByCategory: async (category: string): Promise<ServicesResponse> => {
    try {
      const { data } = await api.get(`/services/category/${category}`);
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch services");
      }
      throw new Error("Failed to fetch services");
    }
  },

  // Create a new service (provider only)
  createService: async (serviceData: Omit<Service, "_id" | "provider" | "createdAt" | "updatedAt">): Promise<{ message: string; service: Service }> => {
    try {
      const { data } = await api.post("/services", serviceData);
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to create service");
      }
      throw new Error("Failed to create service");
    }
  },

  // Update a service (provider only)
  updateService: async (serviceId: string, serviceData: Partial<Service>): Promise<{ message: string; service: Service }> => {
    try {
      const { data } = await api.patch(`/services/${serviceId}`, serviceData);
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to update service");
      }
      throw new Error("Failed to update service");
    }
  },

  // Delete a service (provider only)
  deleteService: async (serviceId: string): Promise<{ message: string }> => {
    try {
      const { data } = await api.delete(`/services/${serviceId}`);
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to delete service");
      }
      throw new Error("Failed to delete service");
    }
  },
};
