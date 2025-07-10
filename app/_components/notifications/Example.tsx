// Example usage in a component
"use client";

import { CustomOrderNotification } from "@/app/_components/notifications/CustomOrderNotification";
import { notify, notifyPromise } from "@/app/_lib/notifications";

export default function Example() {
  // Simple notifications
  const handleSimpleNotification = () => {
    notify({
      message: "This is a simple notification",
      permanent: true,
    });
  };

  const handleAlertNotification = () => {
    notify({
      type: "alert",
      message: "This is an alert message",
      data: { userId: 123, action: "login" },
    });
  };

  const handleNotificationWithAction = () => {
    notify({
      type: "success",
      message: "Profile updated successfully",
      action: {
        label: "View Profile",
        onClick: () => console.log("Navigate to profile"),
      },
    });
  };

  // Loading notification with promise
  const handleAsyncOperation = async () => {
    const mockApiCall = () =>
      new Promise<{ orderId: string; amount: number }>((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.3) {
            resolve({ orderId: "ORD-12345", amount: 99.99 });
          } else {
            reject(new Error("Payment failed"));
          }
        }, 3000);
      });

    notifyPromise(mockApiCall(), {
      loading: "Processing your order...",
      success: (data) => `Order ${data.orderId} created successfully!`,
      error: (error) => `Failed to create order: ${error.message}`,
      loadingData: { step: "payment" },
      successData: { orderId: "ORD-12345", amount: 99.99 },
      successAction: {
        label: "View Order",
        onClick: () => console.log("Navigate to order"),
      },
      errorAction: {
        label: "Try Again",
        onClick: () => handleAsyncOperation(),
        variant: "destructive",
      },
    });
  };

  // Custom notification
  const handleCustomNotification = () => {
    notify({
      type: "custom",
      message: "Order completed successfully!",
      component: CustomOrderNotification,
      componentProps: {},
      data: {
        orderId: "ORD-67890",
        amount: 149.99,
        items: 3,
      },
    });
  };

  // Permanent notification example
  const handlePermanentNotification = () => {
    notify({
      type: "error",
      message: "Critical system error - manual intervention required",
      permanent: true,
      data: { errorCode: "SYS_001", severity: "critical" },
      action: {
        label: "Contact Support",
        onClick: () => console.log("Opening support chat"),
        variant: "destructive",
      },
    });
  };

  // Custom duration notification
  const handleCustomDurationNotification = () => {
    notify({
      type: "warning",
      message: "Session expires in 5 minutes",
      duration: 10000, // 10 seconds
      action: {
        label: "Extend Session",
        onClick: () => console.log("Extending session"),
      },
    });
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Notification Examples</h1>

      <div className="grid gap-4">
        <button
          onClick={handleSimpleNotification}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Simple Notification
        </button>

        <button
          onClick={handleAlertNotification}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Alert with Data
        </button>

        <button
          onClick={handleNotificationWithAction}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Success with Action
        </button>

        <button
          onClick={handleAsyncOperation}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Async Operation (Loading → Success/Error)
        </button>

        <button
          onClick={handleCustomNotification}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
        >
          Custom Order Notification
        </button>

        <button
          onClick={handlePermanentNotification}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Permanent Error Notification
        </button>

        <button
          onClick={handleCustomDurationNotification}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Custom Duration (10s)
        </button>
      </div>
    </div>
  );
}
