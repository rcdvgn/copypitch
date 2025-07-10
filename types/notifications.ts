// types/notifications.ts
export type NotificationType =
  | "notification"
  | "alert"
  | "success"
  | "error"
  | "warning"
  | "loading"
  | "custom";

export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline";
}

export interface BaseNotificationProps {
  type?: NotificationType;
  message: string;
  data?: Record<string, any>;
  action?: NotificationAction;
  permanent?: boolean;
  duration?: number;
  dismissible?: boolean;
}

export interface CustomNotificationProps extends BaseNotificationProps {
  type: "custom";
  component: React.ComponentType<any>;
  componentProps?: Record<string, any>;
}

export type NotificationProps = BaseNotificationProps | CustomNotificationProps;
