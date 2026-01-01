export interface Notification {
  notificationId: string;
  type: string;
  message: string;
  bookingId?: string;
  reviewId?: string;
  createdAt: string;
  isRead?: boolean;
}
