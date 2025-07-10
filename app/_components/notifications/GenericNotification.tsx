// components/notifications/GenericNotification.tsx
import React from "react";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
  X,
} from "lucide-react";
import { NotificationType, NotificationAction } from "@/types/notifications";

interface GenericNotificationProps {
  type: NotificationType;
  message: string;
  action?: NotificationAction;
  data?: Record<string, any>;
  permanent?: boolean;
  dismissible?: boolean; // Add this
  onDismiss?: () => void; // Add this
}

const iconMap = {
  notification: Info,
  alert: AlertCircle,
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  loading: Loader2,
  custom: Info, // fallback
};

const colorMap = {
  notification: "text-blue-500",
  alert: "text-orange-500",
  success: "text-green-500",
  error: "text-red-500",
  warning: "text-yellow-500",
  loading: "text-blue-500",
  custom: "text-blue-500",
};

export function GenericNotification({
  type,
  message,
  action,
  data,
  permanent = false,
  dismissible = true, // Add this with default
  onDismiss, // Add this
}: GenericNotificationProps) {
  const Icon = iconMap[type];
  const iconColor = colorMap[type];

  return (
    <div className="flex items-start gap-3 p-4 bg-bg-tertiary rounded-2xl shadow-lg border border-border min-w-[350px] max-w-[450px]">
      <div className={`flex-shrink-0 ${iconColor}`}>
        <Icon size={20} className={type === "loading" ? "animate-spin" : ""} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text leading-5">{message}</p>

        {permanent && (
          <p className="text-xs text-text-secondary mt-1">
            This notification will persist until dismissed
          </p>
        )}

        {data && Object.keys(data).length > 0 && (
          <div className="mt-1 text-xs text-gray-500">
            {Object.entries(data).map(([key, value]) => (
              <span key={key} className="block">
                {key}: {String(value)}
              </span>
            ))}
          </div>
        )}

        {action && (
          <button
            onClick={action.onClick}
            className={`mt-2 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              action.variant === "destructive"
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : action.variant === "outline"
                ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            {action.label}
          </button>
        )}
      </div>

      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="h-5 w-5 flex-shrink-0 text-text-secondary hover:text-text transition-colors ml-2"
          aria-label="Dismiss notification"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
