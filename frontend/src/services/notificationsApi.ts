import { api } from "@/lib/api";

export interface Notification {
  _id: string;
  user: string;
  type: string;
  message: string;
  booking?: string;
  review?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
  const { data } = await api.get("/notifications");
  return data;
};

export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
  const { data } = await api.put(`/notifications/${notificationId}/read`);
  return data.notification;
};