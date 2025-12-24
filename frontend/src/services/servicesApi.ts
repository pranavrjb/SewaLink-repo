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
  rating?: number;      // mapped from backend ratings
  reviewCount?: number; // mapped from backend reviewsCount
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
      // Map backend ratings/reviewsCount to frontend
      const mappedServices = data.map((s: any) => ({
        ...s,
        rating: s.ratings,
        reviewCount: s.reviewsCount,
      }));
      return { services: mappedServices };
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
      return {
        service: {
          ...data,
          rating: data.ratings,
          reviewCount: data.reviewsCount,
        },
      };
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch service");
      }
      throw new Error("Failed to fetch service");
    }
  },

  // Create a new service (provider only)
  createService: async (
    serviceData: Omit<Service, "_id" | "provider" | "createdAt" | "updatedAt">
  ): Promise<{ message: string; service: Service }> => {
    try {
      const { data } = await api.post("/services/add", serviceData); // ✅ fixed route
      return {
        message: data.message,
        service: {
          ...data,
          rating: data.ratings,
          reviewCount: data.reviewsCount,
        },
      };
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to create service");
      }
      throw new Error("Failed to create service");
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
