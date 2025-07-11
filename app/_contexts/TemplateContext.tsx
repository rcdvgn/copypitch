"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import {
  createTemplate,
  createVariant,
  fetchTemplateVariants,
  fetchUserTemplates,
  getDefaultVariant,
  makeVariantDefault,
} from "@/app/_lib/db/templates";
import { useTemplateUpdates } from "@/app/_utils/templateEditorUtils";
import { useUsageErrors } from "../_hooks/useUsageErrors";
import { toast } from "sonner";
import { notify } from "../_lib/notifications";

interface Template {
  id: string;
  title: string;
  name: string;
  category: string;
  variables: Record<string, string>;
  variantIds: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface Variant {
  id: string;
  name: string;
  content: string;
  templateId: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface TemplateContextType {
  // Template state
  templates: Template[];
  currentTemplate: Template | null;
  currentTemplateId: string | null;

  // Variant state
  variants: Variant[];
  currentVariant: Variant | null;
  currentVariantId: string | null;

  // Variable state
  variables: Record<string, string>;

  // UI state
  isEditing: boolean;
  isFullView: boolean;
  showVariableEditor: boolean;

  // Template actions
  createNewTemplate: (name: string, category?: string) => any;
  deleteTemplate: (templateId: string) => Promise<void>;
  selectTemplate: (templateId: string) => void;

  // Variant actions
  selectVariant: (variantId: string) => void;
  addVariant: () => Promise<void>;
  updateVariantContent: (content: string) => void;
  makeVariantDefault: (variantId: string) => Promise<void>;

  // Variable actions
  updateVariable: (varName: string, value: string) => void;
  clearAllVariables: () => void;

  // UI actions
  setIsEditing: (editing: boolean) => void;
  setIsFullView: (isFullView: boolean) => void;
  setShowVariableEditor: (show: boolean) => void;

  // Computed properties
  hasVariables: boolean;
  currentVariables: string[];
}

const TemplateContext = createContext<TemplateContextType | undefined>(
  undefined
);

export const useTemplateContext = () => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error(
      "useTemplateContext must be used within a TemplateProvider"
    );
  }
  return context;
};

export const TemplateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { handleUsageError } = useUsageErrors();
  const { debouncedUpdateTemplateVariables, debouncedUpdateVariant } =
    useTemplateUpdates();

  // Extract templateId from route parameters
  // For optional catch-all routes, params.templateId will be an array or undefined
  const currentTemplateId = (() => {
    if (!params?.templateId) return null;

    // Handle catch-all route where templateId is an array
    if (Array.isArray(params.templateId)) {
      return params.templateId[0] || null;
    }

    // Handle regular dynamic route where templateId is a string
    return params.templateId as string;
  })();

  // Core state
  const [templates, setTemplates] = useState<Template[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [currentVariantId, setCurrentVariantId] = useState<string | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});

  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [isFullView, setIsFullView] = useState(false);
  const [showVariableEditor, setShowVariableEditor] = useState(false);

  // Computed properties
  const currentTemplate =
    templates.find((t) => t.id === currentTemplateId) || null;
  const currentVariant =
    variants.find((v) => v.id === currentVariantId) || null;

  // Extract variables from current variant content
  const extractVariables = useCallback((content: string) => {
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const variables: string[] = [];
    let match;
    while ((match = variableRegex.exec(content)) !== null) {
      if (!variables.includes(match[1].trim())) {
        variables.push(match[1].trim());
      }
    }
    return variables;
  }, []);

  const currentVariables = currentVariant
    ? extractVariables(currentVariant.content)
    : [];
  const hasVariables = Object.keys(variables).length > 0;

  // RESTORED: Auto-sync variant content to Firestore when editing
  useEffect(() => {
    if (
      currentVariant &&
      currentVariantId &&
      currentVariant.content !== undefined &&
      isEditing
    ) {
      debouncedUpdateVariant(currentVariantId, currentVariant.content);
    }
    return () => {
      debouncedUpdateVariant.cancel();
    };
  }, [
    currentVariant?.content,
    currentVariantId,
    isEditing,
    debouncedUpdateVariant,
  ]);

  // RESTORED: Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedUpdateVariant.cancel();
    };
  }, [debouncedUpdateVariant]);

  // Load templates on mount
  useEffect(() => {
    if (!user?.id) return;

    const loadTemplates = async () => {
      try {
        const fetchedTemplates: any = await fetchUserTemplates(user.id);
        setTemplates(fetchedTemplates);
      } catch (error) {
        console.error("Error loading templates:", error);
      }
    };

    loadTemplates();
  }, [user?.id]);

  // Load variants when template changes
  useEffect(() => {
    if (!currentTemplateId) {
      setVariants([]);
      setCurrentVariantId(null);
      return;
    }

    const loadVariants = async () => {
      try {
        const fetchedVariants: any = await fetchTemplateVariants(
          currentTemplateId
        );
        setVariants(fetchedVariants);

        // Select the first variant (default should be first)
        if (fetchedVariants.length > 0) {
          setCurrentVariantId(fetchedVariants[0].id);
        }
      } catch (error) {
        console.error("Error loading variants:", error);
      }
    };

    loadVariants();
  }, [currentTemplateId]);

  // Update variables when variant or template changes
  useEffect(() => {
    if (!currentVariant || !currentTemplate) {
      setVariables({});
      return;
    }

    const textVariables = extractVariables(currentVariant.content);
    const savedVariables = currentTemplate.variables || {};

    // Merge saved variables with text variables
    const mergedVariables: Record<string, string> = {};

    // Add all variables from text
    textVariables.forEach((varName: string) => {
      mergedVariables[varName] = savedVariables[varName] || "";
    });

    // Add permanent variables that aren't in text but have values
    Object.entries(savedVariables).forEach(([key, value]) => {
      if (value && !textVariables.includes(key)) {
        mergedVariables[key] = value;
      }
    });

    setVariables(mergedVariables);
  }, [currentVariant, currentTemplate, extractVariables]);

  // Template actions
  const createNewTemplate = async (
    name: string,
    category: string = "General"
  ) => {
    if (!user?.id) return false;

    try {
      const newTemplate = await createTemplate({
        userId: user.id,
        name,
        category,
        variables: {},
      });

      // Create the default variant
      await createVariant(user.id, newTemplate.id, "", null, "Default", true);

      setTemplates((prev) => [newTemplate, ...prev]);

      // Navigate to the new template
      router.push(`/t/${newTemplate.id}`);
      setIsEditing(true);

      return true; // Success
    } catch (error) {
      const errorInfo = handleUsageError(error);

      if (errorInfo.isUsageError) {
        // Show upgrade prompt or usage limit modal
        notify({
          type: "error",
          message: errorInfo.message,
        });
      } else {
        // Handle other errors
        notify({
          type: "error",
          message: errorInfo.message,
        });
      }

      return false; // Failed
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      setTemplates((prev) => prev.filter((t) => t.id !== templateId));

      // If we're deleting the current template, navigate away
      if (templateId === currentTemplateId) {
        router.push("/t");
      }
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  const selectTemplate = (templateId: string) => {
    router.push(`/t/${templateId}`);
  };

  // Variant actions
  const selectVariant = (variantId: string) => {
    setCurrentVariantId(variantId);
  };

  const addVariant = async () => {
    if (!currentTemplateId || !user?.id) return;

    try {
      // Get the default variant's content
      const defaultVariant: any = await getDefaultVariant(currentTemplateId);
      const defaultContent = defaultVariant?.content || "";

      const name = `Variant ${variants.length}`;

      const newVariant = await createVariant(
        user.id,
        currentTemplateId,
        defaultContent,
        null,
        name,
        false
      );

      setVariants((prev) => [...prev, newVariant]);
      setCurrentVariantId(newVariant.id);
      setIsEditing(true);
    } catch (error) {
      console.error("Error adding variant:", error);
    }
  };

  // RESTORED: This function now properly updates local state and triggers Firestore sync
  const updateVariantContent = (content: string) => {
    if (!currentVariantId) return;

    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === currentVariantId ? { ...variant, content } : variant
      )
    );
    // Note: Firestore sync happens automatically via the useEffect above
  };

  const makeVariantDefaultAction = async (variantId: string) => {
    if (!currentTemplateId) return;

    try {
      await makeVariantDefault(currentTemplateId, variantId);

      // Update local state
      setVariants((prev) =>
        prev
          .map((variant) => ({
            ...variant,
            isDefault: variant.id === variantId,
          }))
          .sort((a, b) => {
            if (a.isDefault && !b.isDefault) return -1;
            if (!a.isDefault && b.isDefault) return 1;
            return 0;
          })
      );
    } catch (error) {
      console.error("Error making variant default:", error);
    }
  };

  // Variable actions
  const updateVariable = useCallback(
    (varName: string, value: string) => {
      setVariables((prev) => ({
        ...prev,
        [varName]: value,
      }));

      if (currentTemplate) {
        const textVariables = extractVariables(currentVariant?.content || "");

        // Determine what should be saved to Firestore
        const variablesToSave: Record<string, string> = {};

        // Only save variables that have values
        Object.entries({ ...variables, [varName]: value }).forEach(
          ([key, val]) => {
            if (val) {
              variablesToSave[key] = val;
            }
          }
        );

        // Filter out variables with no value that aren't in text
        const filteredVariables = Object.fromEntries(
          Object.entries(variablesToSave).filter(([key, val]) => {
            return val || textVariables.includes(key);
          })
        );

        // Update Firestore with permanent variables only
        const permanentVariables = Object.fromEntries(
          Object.entries(filteredVariables).filter(([key, val]) => val)
        );

        debouncedUpdateTemplateVariables(
          currentTemplate.id,
          permanentVariables
        );

        // Update local template state
        setTemplates((prev) =>
          prev.map((template) =>
            template.id === currentTemplate.id
              ? { ...template, variables: permanentVariables }
              : template
          )
        );
      }
    },
    [
      currentTemplate,
      currentVariant,
      variables,
      extractVariables,
      debouncedUpdateTemplateVariables,
    ]
  );

  const clearAllVariables = () => {
    const textVariables = extractVariables(currentVariant?.content || "");
    const clearedVariables: Record<string, string> = {};

    // Keep text variables but clear their values
    textVariables.forEach((varName: string) => {
      clearedVariables[varName] = "";
    });

    setVariables(clearedVariables);

    // Update Firestore to remove all saved variables
    if (currentTemplate) {
      debouncedUpdateTemplateVariables(currentTemplate.id, {});

      // Update local template state
      setTemplates((prev) =>
        prev.map((template) =>
          template.id === currentTemplate.id
            ? { ...template, variables: {} }
            : template
        )
      );
    }
  };

  const contextValue: TemplateContextType = {
    // Template state
    templates,
    currentTemplate,
    currentTemplateId,

    // Variant state
    variants,
    currentVariant,
    currentVariantId,

    // Variable state
    variables,

    // UI state
    isEditing,
    isFullView,
    showVariableEditor,

    // Template actions
    createNewTemplate,
    deleteTemplate,
    selectTemplate,

    // Variant actions
    selectVariant,
    addVariant,
    updateVariantContent,
    makeVariantDefault: makeVariantDefaultAction,

    // Variable actions
    updateVariable,
    clearAllVariables,

    // UI actions
    setIsEditing,
    setIsFullView,
    setShowVariableEditor,

    // Computed properties
    hasVariables,
    currentVariables,
  };

  return (
    <TemplateContext.Provider value={contextValue}>
      {children}
    </TemplateContext.Provider>
  );
};
