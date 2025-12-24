import { formatDistanceToNow } from "date-fns";
import { Bell, Calendar, Star, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Notification } from "@/services/notificationsApi";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "NEW_BOOKING":
    case "BOOKING_UPDATE":
      return Calendar;
    case "NEW_REVIEW":
      return Star;
    default:
      return Bell;
  }
};

export const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
  const Icon = getNotificationIcon(notification.type);

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 hover:bg-accent/50 cursor-pointer transition-colors border-b border-border last:border-0",
        !notification.isRead && "bg-primary/5"
      )}
      onClick={() => !notification.isRead && onMarkAsRead(notification._id)}
    >
      <div className={cn(
        "p-2 rounded-full",
        notification.isRead ? "bg-muted" : "bg-primary/10"
      )}>
        <Icon className={cn(
          "h-4 w-4",
          notification.isRead ? "text-muted-foreground" : "text-primary"
        )} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm leading-tight",
          !notification.isRead && "font-medium"
        )}>
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>

      {!notification.isRead && (
        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
      )}
    </div>
  );
};
