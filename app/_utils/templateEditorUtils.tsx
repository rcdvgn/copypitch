// templateEditorUtils.tsx
import { useCallback } from "react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import _ from "lodash";
import { db } from "@/app/_config/firebase/client";

export function useVariables(selectedVariant: any) {
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

  const getCurrentVariables = useCallback(() => {
    if (!selectedVariant) return [];
    return extractVariables(selectedVariant.content);
  }, [extractVariables, selectedVariant]);

  return { getCurrentVariables };
}

export function replaceVariables(
  content: string,
  variables: Record<string, string>
) {
  let result = content;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g");
    result = result.replace(regex, value);
  });
  return result;
}

// New unified debounced update hook
export function useTemplateUpdates() {
  const debouncedUpdateVariant = useCallback(
    _.debounce(async (variantId: string, content: string) => {
      try {
        const variantRef = doc(db, "variants", variantId);
        await updateDoc(variantRef, {
          content: content,
          updatedAt: serverTimestamp(),
        });
        console.log("Variant content updated successfully");
      } catch (error) {
        console.error("Error updating variant content:", error);
      }
    }, 500),
    []
  );

  const debouncedUpdateTemplate = useCallback(
    _.debounce(
      async (templateId: string, variables: Record<string, string>) => {
        try {
          const templateRef = doc(db, "templates", templateId);
          await updateDoc(templateRef, {
            variables: variables,
            updatedAt: serverTimestamp(),
          });
          console.log("Template variables updated successfully");
        } catch (error) {
          console.error("Error updating template variables:", error);
        }
      },
      500
    ),
    []
  );

  // Updated function to update template variables
  const debouncedUpdateTemplateVariables = useCallback(
    _.debounce(
      async (templateId: string, variables: Record<string, string>) => {
        try {
          const templateRef = doc(db, "templates", templateId);
          await updateDoc(templateRef, {
            variables: variables,
            updatedAt: serverTimestamp(),
          });
          console.log("Template variables updated successfully");
        } catch (error) {
          console.error("Error updating template variables:", error);
        }
      },
      500
    ),
    []
  );

  return {
    debouncedUpdateVariant,
    debouncedUpdateTemplate,
    debouncedUpdateTemplateVariables,
  };
}
