import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import socket from "@/socket";
import {api} from "@/lib/api";
import { Notification } from "@/types/notification";

interface NotificationContextType {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch stored notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await api.get<Notification[]>("/notifications");
      setNotifications(res.data);
    };
    fetchNotifications();
  }, []);

  // Listen for real-time notifications
  useEffect(() => {
    socket.on("notification", (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
};
