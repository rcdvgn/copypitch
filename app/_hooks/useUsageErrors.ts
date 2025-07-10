// hooks/useUsageErrors.js

import { USAGE_ERRORS } from "../_config/plans";

export const useUsageErrors = () => {
  const handleUsageError = (error: any) => {
    try {
      const errorData = JSON.parse(error.message);

      if (errorData.type === "USAGE_LIMIT_ERROR") {
        return {
          isUsageError: true,
          code: errorData.code,
          current: errorData.current,
          limit: errorData.limit,
          message: getErrorMessage(
            errorData.code,
            errorData.current,
            errorData.limit
          ),
        };
      }
    } catch (e) {
      // Not a usage error
    }

    return {
      isUsageError: false,
      message: error.message,
    };
  };

  const getErrorMessage = (code: any, current: any, limit: any) => {
    switch (code) {
      case USAGE_ERRORS.TEMPLATE_LIMIT_REACHED:
        return `Template limit reached (${current}/${limit}). Upgrade to create more templates.`;

      case USAGE_ERRORS.VARIANT_LIMIT_REACHED:
        return `Variant limit reached (${current}/${limit}). Upgrade to create more variants.`;

      case USAGE_ERRORS.VARIANT_PER_TEMPLATE_LIMIT_REACHED:
        return `Template variant limit reached (${current}/${limit}). Upgrade to add more variants per template.`;

      default:
        return "Usage limit reached. Please upgrade your plan.";
    }
  };

  return { handleUsageError };
};
