import { api } from "@/lib/api";

export interface Review {
  _id: string;
  booking: string;
  service: {
    _id: string;
    title: string;
    category?: string;
  } | string;
  user: {
    _id: string;
    name: string;
    email: string;
  } | string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewResponse {
  reviews: Review[];
  count: number;
}

export interface RatingResponse {
  averageRating: number;
  totalReviews: number;
}

export const reviewsApi = {
  addReview: async (data: {
    bookingId: string;
    rating: number;
    comment?: string;
  }) => {
    const response = await api.post("/reviews/add-review", data);
    return response.data;
  },

  getServiceReviews: async (serviceId: string): Promise<ReviewResponse> => {
    const response = await api.get(`/reviews/service/${serviceId}`);
    return response.data;
  },

  getServiceRating: async (serviceId: string): Promise<RatingResponse> => {
    const response = await api.get(`/reviews/service/${serviceId}/rating`);
    return response.data;
  },

  getMyReviews: async (): Promise<ReviewResponse> => {
    const response = await api.get("/reviews/my-reviews");
    return response.data;
  },

  getProviderReviews: async (): Promise<ReviewResponse & { 
    stats: {
      totalReviews: number;
      averageRating: string;
      ratingBreakdown: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
      };
    };
  }> => {
    const response = await api.get("/reviews/provider-reviews");
    return response.data;
  },

  // Update a review
  updateReview: async (reviewId: string, data: {
    rating?: number;
    comment?: string;
  }) => {
    const response = await api.put(`/reviews/${reviewId}`, data);
    return response.data;
  },

  // Delete a review
  deleteReview: async (reviewId: string) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },
  getAllReviews: async () => {
  const res = await api.get("/reviews/public");
  return res.data;
}
};