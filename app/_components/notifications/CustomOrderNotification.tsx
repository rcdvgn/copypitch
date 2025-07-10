// components/notifications/CustomOrderNotification.tsx
import React from "react";
import { Package, Eye, Download } from "lucide-react";

interface CustomOrderNotificationProps {
  message: string;
  data?: {
    orderId: string;
    amount: number;
    items: number;
  };
  toastId: string | number;
  permanent?: boolean;
  dismissible?: boolean; // Add this
  onDismiss?: () => void; // Add this
}

export function CustomOrderNotification({
  message,
  data,
  toastId,
  permanent = false,
}: CustomOrderNotificationProps) {
  const handleViewOrder = () => {
    console.log("Viewing order:", data?.orderId);
    // Navigate to order page
  };

  const handleDownloadReceipt = () => {
    console.log("Downloading receipt for:", data?.orderId);
    // Download receipt logic
  };

  return (
    <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[350px] max-w-[450px]">
      <div className="flex-shrink-0 text-green-500">
        <Package size={24} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 leading-5">{message}</p>

        {permanent && (
          <p className="text-xs text-gray-500 mt-1">
            This notification will persist until dismissed
          </p>
        )}

        {data && (
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-600">
              Order ID: <span className="font-mono">{data.orderId}</span>
            </p>
            <p className="text-xs text-gray-600">
              Amount: <span className="font-semibold">${data.amount}</span>
            </p>
            <p className="text-xs text-gray-600">Items: {data.items}</p>
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <button
            onClick={handleViewOrder}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
          >
            <Eye size={12} />
            View Order
          </button>

          <button
            onClick={handleDownloadReceipt}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Download size={12} />
            Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
