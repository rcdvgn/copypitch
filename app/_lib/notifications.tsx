// lib/notifications.ts
import React from "react";
import { toast } from "sonner";
import {
  NotificationProps,
  CustomNotificationProps,
  BaseNotificationProps,
  NotificationAction,
} from "@/types/notifications";
import { GenericNotification } from "../_components/notifications/GenericNotification";

export function notify(props: NotificationProps) {
  const {
    type = "notification",
    message,
    data,
    action,
    permanent = false,
    duration,
    dismissible = true,
  } = props;

  // Determine toast duration
  const toastDuration = permanent ? Infinity : duration;

  // Handle custom notifications
  if (type === "custom" && "component" in props) {
    const customProps = props as CustomNotificationProps;
    const CustomComponent = customProps.component;

    return toast.custom(
      (t) => (
        <CustomComponent
          {...customProps.componentProps}
          message={message}
          data={data}
          action={action}
          toastId={t}
          permanent={permanent}
        />
      ),
      {
        duration: toastDuration,
      }
    );
  }

  // Handle generic notifications
  return toast.custom(
    (t) => (
      <GenericNotification
        type={type}
        message={message}
        action={action}
        data={data}
        permanent={permanent}
        dismissible={dismissible} // Add this
        onDismiss={() => toast.dismiss(t)} // Add this
      />
    ),
    {
      duration: toastDuration,
    }
  );
}

// Extended notify function with promise support
export function notifyPromise<T>(
  promise: Promise<T>,
  options: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: Error) => string);
    loadingData?: Record<string, any>;
    successData?: Record<string, any>;
    errorData?: Record<string, any>;
    successAction?: NotificationAction;
    errorAction?: NotificationAction;
  }
) {
  const loadingToast = notify({
    type: "loading",
    message: options.loading,
    data: options.loadingData,
  });

  promise
    .then((data) => {
      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show success notification
      const successMessage =
        typeof options.success === "function"
          ? options.success(data)
          : options.success;

      notify({
        type: "success",
        message: successMessage,
        data: options.successData,
        action: options.successAction,
      });
    })
    .catch((error) => {
      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show error notification
      const errorMessage =
        typeof options.error === "function"
          ? options.error(error)
          : options.error;

      notify({
        type: "error",
        message: errorMessage,
        data: options.errorData,
        action: options.errorAction,
      });
    });

  return loadingToast;
}
