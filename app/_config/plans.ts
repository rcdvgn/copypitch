export const PLAN_LIMITS: any = {
  free: {
    maxTemplates: 3,
    maxVariants: 10,
    maxVariantsPerTemplate: 5,
  },
  standard: {
    maxTemplates: 25,
    maxVariants: 100,
    maxVariantsPerTemplate: 20,
  },
};

export const USAGE_ERRORS: any = {
  TEMPLATE_LIMIT_REACHED: "TEMPLATE_LIMIT_REACHED",
  VARIANT_LIMIT_REACHED: "VARIANT_LIMIT_REACHED",
  VARIANT_PER_TEMPLATE_LIMIT_REACHED: "VARIANT_PER_TEMPLATE_LIMIT_REACHED",
  PLAN_NOT_FOUND: "PLAN_NOT_FOUND",
};
