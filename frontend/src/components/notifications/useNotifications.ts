import { useEffect, useState } from "react";
import { getNotifications, markNotificationAsRead, Notification } from "@/services/notificationsApi";
import { connectSocket, disconnectSocket } from "@/utils/socket";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const userStr = localStorage.getItem("sewalink_user");
    if (!userStr) {
      setIsLoading(false);
      return;
    }

    let socket: any = null;

    try {
      const user = JSON.parse(userStr);
      
      // Check if token exists
      if (!user.token) {
        console.error("No token found in user data");
        setIsLoading(false);
        return;
      }

      // Connect to socket
      socket = connectSocket(user.token);

      // Listen to new notifications from backend
      socket.on("notification", (newNotification: Notification) => {
        console.log("New notification received:", newNotification);
        setNotifications((prev) => [newNotification, ...prev]);
        if (!newNotification.isRead) {
          setUnreadCount((prev) => prev + 1);
        }
      });

      // Fetch initial notifications
      const fetchNotifications = async () => {
        try {
          const data = await getNotifications();
          setNotifications(data);
          setUnreadCount(data.filter((n) => !n.isRead).length);
        } catch (err) {
          console.error("Failed to fetch notifications:", err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchNotifications();
    } catch (err) {
      console.error("Error setting up notifications:", err);
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      if (socket) {
        socket.off("notification");
        disconnectSocket();
      }
    };
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const updated = await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.isRead);
      
      // Mark all as read in parallel
      await Promise.all(
        unreadNotifications.map((n) => markNotificationAsRead(n._id))
      );

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  return { notifications, isLoading, unreadCount, markAsRead, markAllAsRead };
};