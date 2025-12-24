import { api, isAxiosError } from "@/lib/api";

export interface Review {
  _id: string;
  booking: string;
  service: string;
  user: {
    _id: string;
    name: string;
  } | string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddReviewData {
  bookingId: string;
  rating: number;
  comment?: string;
}

export interface ServiceRating {
  averageRating: number;
}

export const reviewsApi = {
  // Add a review for a completed booking
  addReview: async (data: AddReviewData): Promise<{ message: string; review: Review }> => {
    try {
      const response = await api.post("/reviews/add-review", data);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to add review");
      }
      throw new Error("Failed to add review");
    }
  },

  // Get all reviews for a service
  getServiceReviews: async (serviceId: string): Promise<Review[]> => {
    try {
      const response = await api.get(`/reviews/service/${serviceId}`);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch reviews");
      }
      throw new Error("Failed to fetch reviews");
    }
  },

  // Get average rating for a service
  getServiceRating: async (serviceId: string): Promise<ServiceRating> => {
    try {
      const response = await api.get(`/reviews/service/${serviceId}/rating`);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch rating");
      }
      throw new Error("Failed to fetch rating");
    }
  },
};