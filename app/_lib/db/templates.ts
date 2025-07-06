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
} from "firebase/firestore";

const newTemplate = () => ({
  title: "New Template",
  description: "",
  variables: [],
  variantIds: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});

const newVariant = () => ({
  name: "Default",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
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
  setData: any = null
) => {
  const variantData = setData || newVariant();
  try {
    // Create the variation document
    const fullVariant = { ...variantData, userId, content, templateId };

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
    // Sort by updatedAt in descending order (newest first)
    const q = query(
      collection(db, "variants"),
      where("templateId", "==", templateId),
      orderBy("updatedAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching template variants:", error);
    throw error;
  }
};
