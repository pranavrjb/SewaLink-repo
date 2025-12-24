import { useState, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import { getNotifications, markNotificationAsRead, Notification } from "@/services/notificationsApi";

const SOCKET_URL = "http://localhost:5000/api/v1";

export const useNotifications = () => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    const unreadNotifications = notifications.filter((n) => !n.isRead);
    await Promise.all(unreadNotifications.map((n) => markNotificationAsRead(n._id)));
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }, [notifications]);

  // Socket.IO connection
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
      newSocket.emit("register_user", user.id);
    });

    newSocket.on("notification", (notification: Notification) => {
      console.log("New notification received:", notification);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user?.id]);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
};
