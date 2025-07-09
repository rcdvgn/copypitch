import { db } from "@/app/_config/firebase/client";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  arrayUnion,
  writeBatch,
} from "firebase/firestore";

const newTemplate = () => ({
  title: "New Template",
  description: "",
  variables: {},
  variantIds: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});

const newVariant = () => ({
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isDefault: false,
});

export const createTemplate = async ({
  userId,
  name,
  category,
  setData = null,
}: any = {}) => {
  const templateData = setData || newTemplate();
  try {
    const fullTemplate = { ...templateData, userId, name, category };

    const docRef = await addDoc(collection(db, "templates"), fullTemplate);

    return {
      id: docRef.id,
      ...fullTemplate,
    };
  } catch (error) {
    console.error("Error creating template:", error);
    throw error;
  }
};

export const createVariant = async (
  userId: any,
  templateId: any,
  content: any = "",
  setData: any = null,
  name: any = "New Variant",
  isDefault: boolean = false
) => {
  const variantData = setData || newVariant();
  try {
    // Create the variation document
    const fullVariant = {
      ...variantData,
      userId,
      content,
      templateId,
      name,
      isDefault,
    };

    const docRef = await addDoc(collection(db, "variants"), fullVariant);

    // Add the variation ID to the template's variationIds array
    await updateDoc(doc(db, "templates", templateId), {
      variantIds: arrayUnion(docRef.id),
      updatedAt: new Date().toISOString(),
    });

    return {
      id: docRef.id,
      ...fullVariant,
    };
  } catch (error) {
    console.error("Error creating variation:", error);
    throw error;
  }
};

export const fetchUserTemplates = async (userId: string) => {
  try {
    const q = query(
      collection(db, "templates"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching user templates:", error);
    throw error;
  }
};

export const fetchTemplateVariants = async (templateId: string) => {
  try {
    if (!templateId) {
      return [];
    }

    // Query variants collection where templateId field matches the passed templateId
    const q = query(
      collection(db, "variants"),
      where("templateId", "==", templateId),
      orderBy("updatedAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const variants = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort variants to ensure default variant is first
    return variants.sort((a: any, b: any) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return 0;
    });
  } catch (error) {
    console.error("Error fetching template variants:", error);
    throw error;
  }
};

// Helper function to make a variant the default variant
export const makeVariantDefault = async (
  templateId: string,
  variantId: string
) => {
  try {
    const batch = writeBatch(db);

    // First, get all variants for this template
    const variantsQuery = query(
      collection(db, "variants"),
      where("templateId", "==", templateId)
    );
    const variantsSnapshot = await getDocs(variantsQuery);

    // Update all variants to not be default
    variantsSnapshot.docs.forEach((variantDoc) => {
      const variantRef = doc(db, "variants", variantDoc.id);
      batch.update(variantRef, { isDefault: false });
    });

    // Set the selected variant as default
    const selectedVariantRef = doc(db, "variants", variantId);
    batch.update(selectedVariantRef, { isDefault: true });

    // Update template's updatedAt timestamp
    const templateRef = doc(db, "templates", templateId);
    batch.update(templateRef, { updatedAt: new Date().toISOString() });

    await batch.commit();
    console.log("Default variant updated successfully");
  } catch (error) {
    console.error("Error making variant default:", error);
    throw error;
  }
};

// Helper function to get the default variant for a template
export const getDefaultVariant = async (templateId: string) => {
  try {
    const q = query(
      collection(db, "variants"),
      where("templateId", "==", templateId),
      where("isDefault", "==", true)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const defaultVariantDoc = querySnapshot.docs[0];
    return {
      id: defaultVariantDoc.id,
      ...defaultVariantDoc.data(),
    };
  } catch (error) {
    console.error("Error fetching default variant:", error);
    throw error;
  }
};
