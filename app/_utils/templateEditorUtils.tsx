import { useCallback } from "react";

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
