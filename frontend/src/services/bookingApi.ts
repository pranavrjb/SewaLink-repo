import { api, isAxiosError } from "@/lib/api";

interface BookingData {
  serviceId: string;
  serviceAddress: string;
  preferredDate: string;
  notes?: string;
}

interface Booking {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  service: {
    _id: string;
    title: string;
    category: string;
    price: number;
    image?: string;
    provider: {
      _id: string;
      name: string;
    };
  };
  serviceAddress: string;
  preferredDate: string;
  notes?: string;
  status: "pending" | "accepted" | "rejected" | "Completed" | "Cancelled";
  createdAt: string;
  updatedAt: string;
}

export const bookingApi = {
  // Create a new booking
  createBooking: async (data: BookingData): Promise<{ message: string; booking: Booking }> => {
    try {
      const { data: result } = await api.post("/bookings/book", data);
      return result;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to create booking");
      }
      throw new Error("Failed to create booking");
    }
  },

  // Get user's bookings
  getUserBookings: async (): Promise<Booking[]> => {
    try {
      const { data } = await api.get("/bookings/my");
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch bookings");
      }
      throw new Error("Failed to fetch bookings");
    }
  },

  // Get provider's bookings
  getProviderBookings: async (): Promise<Booking[]> => {
    try {
      const { data } = await api.get("/bookings/provider");
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch bookings");
      }
      throw new Error("Failed to fetch bookings");
    }
  },

  // Update booking status
  updateBookingStatus: async (
    bookingId: string,
    status: "accepted" | "rejected" | "completed" | "cancelled"
  ): Promise<{ message: string; booking: Booking }> => {
    try {
      const { data } = await api.patch(`/bookings/${bookingId}/status`, { status });
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to update booking status");
      }
      throw new Error("Failed to update booking status");
    }
  },

  // Cancel booking (user)
  cancelBooking: async (bookingId: string): Promise<{ message: string; booking: Booking }> => {
    return bookingApi.updateBookingStatus(bookingId, "cancelled");
  },
};

export type { Booking, BookingData };
