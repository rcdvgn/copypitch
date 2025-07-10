// utils/usageLimits.js
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../_config/firebase/client";
import { PLAN_LIMITS, USAGE_ERRORS } from "../_config/plans";

export const checkUsageLimits = async (
  userId: any,
  action: any,
  templateId = null
) => {
  try {
    // Get user document
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();
    const userPlan = userData.plan || "free";
    const limits = PLAN_LIMITS[userPlan];

    if (!limits) {
      return { canPerform: false, error: USAGE_ERRORS.PLAN_NOT_FOUND };
    }

    switch (action) {
      case "CREATE_TEMPLATE":
        return await checkTemplateLimit(userId, limits);

      case "CREATE_VARIANT":
        return await checkVariantLimit(userId, templateId, limits);

      default:
        return { canPerform: false, error: "Invalid action" };
    }
  } catch (error) {
    console.error("Error checking usage limits:", error);
    return { canPerform: false, error: "Check failed" };
  }
};

const checkTemplateLimit = async (userId: any, limits: any) => {
  const templatesQuery = query(
    collection(db, "templates"),
    where("userId", "==", userId)
  );

  const templatesSnapshot = await getDocs(templatesQuery);
  const currentTemplateCount = templatesSnapshot.size;

  if (currentTemplateCount >= limits.maxTemplates) {
    return {
      canPerform: false,
      error: USAGE_ERRORS.TEMPLATE_LIMIT_REACHED,
      current: currentTemplateCount,
      limit: limits.maxTemplates,
    };
  }

  return { canPerform: true };
};

const checkVariantLimit = async (userId: any, templateId: any, limits: any) => {
  // Check total variants limit
  const variantsQuery = query(
    collection(db, "variants"),
    where("userId", "==", userId)
  );

  const variantsSnapshot = await getDocs(variantsQuery);
  const currentVariantCount = variantsSnapshot.size;

  if (currentVariantCount >= limits.maxVariants) {
    return {
      canPerform: false,
      error: USAGE_ERRORS.VARIANT_LIMIT_REACHED,
      current: currentVariantCount,
      limit: limits.maxVariants,
    };
  }

  // Check variants per template limit
  if (templateId) {
    const templateVariantsQuery = query(
      collection(db, "variants"),
      where("templateId", "==", templateId)
    );

    const templateVariantsSnapshot = await getDocs(templateVariantsQuery);
    const currentTemplateVariantCount = templateVariantsSnapshot.size;

    if (currentTemplateVariantCount >= limits.maxVariantsPerTemplate) {
      return {
        canPerform: false,
        error: USAGE_ERRORS.VARIANT_PER_TEMPLATE_LIMIT_REACHED,
        current: currentTemplateVariantCount,
        limit: limits.maxVariantsPerTemplate,
      };
    }
  }

  return { canPerform: true };
};
