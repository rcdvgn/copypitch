// page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FileText } from "lucide-react";
import {
  createTemplate,
  createVariant,
  fetchTemplateVariants,
  fetchUserTemplates,
  getDefaultVariant,
  makeVariantDefault,
} from "@/app/_lib/db/templates";
import { useAuth } from "@/app/_contexts/AuthContext";
import VariantContent from "@/app/_components/templateEditor/VariantContent";
import VariableEditor from "@/app/_components/templateEditor/VariableEditor";
import TemplateHeader from "@/app/_components/templateEditor/TemplateHeader";
import Sidebar from "@/app/_components/main/Sidebar";
import {
  replaceVariables,
  useVariables,
  useTemplateUpdates,
} from "@/app/_utils/templateEditorUtils";
import VariantsTabs from "@/app/_components/templateEditor/VariantsTabs";

const Templates: React.FC = () => {
  const { user } = useAuth();
  const { debouncedUpdateTemplateVariables } = useTemplateUpdates();

  // Core state
  const [templates, setTemplates] = useState<any>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [copiedId, setCopiedId] = useState<any>(null);
  const [showVariableEditor, setShowVariableEditor] = useState(false);

  // Variables state - now managed per variant
  const [variables, setVariables] = useState<any>({});

  // Load templates on mount
  useEffect(() => {
    const handleFetchTemplates = async () => {
      const fetchedTemplates: any = await fetchUserTemplates(user?.id);
      setTemplates(fetchedTemplates);
    };
    handleFetchTemplates();
  }, [user?.id]);

  // Load variants when template changes
  useEffect(() => {
    if (!selectedTemplate) return;

    const handleFetchTemplateVariants = async () => {
      const fetchedTemplateVariants = await fetchTemplateVariants(
        selectedTemplate?.id
      );
      setVariants(fetchedTemplateVariants);
      setSelectedVariant(fetchedTemplateVariants[0]?.id);
    };
    handleFetchTemplateVariants();
  }, [selectedTemplate]);

  // Variable extraction logic
  const selectedVariantData = variants.find(
    (v: any) => v.id === selectedVariant
  );
  const { getCurrentVariables } = useVariables(selectedVariantData);

  // Update variables when variant changes
  useEffect(() => {
    if (selectedVariantData && selectedTemplate) {
      const textVariables = getCurrentVariables(); // Variables from text
      const savedVariables = selectedTemplate.variables || {}; // Variables from template

      // Merge saved variables with text variables
      const mergedVariables: Record<string, string> = {};

      // Add all variables from text (temporary)
      textVariables.forEach((varName: string) => {
        mergedVariables[varName] = savedVariables[varName] || "";
      });

      // Add permanent variables that aren't in text but have values
      Object.entries(savedVariables).forEach(([key, value]) => {
        if (value && !textVariables.includes(key)) {
          mergedVariables[key] = value as string;
        }
      });

      setVariables(mergedVariables);
    }
  }, [
    selectedVariant,
    selectedVariantData?.content,
    selectedTemplate?.variables,
  ]);

  // Handle variable changes and determine what to save
  const handleVariableChange = useCallback(
    (varName: string, value: string) => {
      setVariables((prev: any) => ({
        ...prev,
        [varName]: value,
      }));

      if (selectedTemplate) {
        const textVariables = getCurrentVariables();
        const savedVariables = selectedTemplate.variables || {};

        // Determine what should be saved to Firestore
        const variablesToSave: Record<string, string> = {};

        // Only save variables that have values
        Object.entries({ ...variables, [varName]: value }).forEach(
          ([key, val]: any) => {
            if (val) {
              variablesToSave[key] = val;
            }
          }
        );

        // Remove variables that:
        // 1. Have no value AND are not in text (temporary variables)
        // 2. Had their value cleared
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
          selectedTemplate.id,
          permanentVariables
        );

        // Update local template state
        setSelectedTemplate((prev: any) => ({
          ...prev,
          variables: permanentVariables,
        }));

        // Update templates array
        setTemplates((prev: any) =>
          prev.map((template: any) =>
            template.id === selectedTemplate.id
              ? { ...template, variables: permanentVariables }
              : template
          )
        );
      }
    },
    [
      selectedTemplate,
      variables,
      getCurrentVariables,
      debouncedUpdateTemplateVariables,
    ]
  );

  const copyToClipboard = async (text: string, id: string) => {
    try {
      const processedText = replaceVariables(text, variables);
      await navigator.clipboard.writeText(processedText);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const addNewTemplate = async (name: any, category: any = "General") => {
    const newTemplate = await createTemplate({
      userId: user?.id,
      name,
      category,
      variables: {}, // Initialize with empty variables
    });

    // Create the default variant
    await createVariant(
      user?.id,
      newTemplate.id,
      "",
      null,
      "Default",
      true // Mark as default
    );

    setTemplates([...templates, newTemplate]);
    setSelectedTemplate(newTemplate);
    setIsEditing(true);
    setShowVariableEditor(false);
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(templates.filter((t: any) => t.id !== templateId));
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null);
      setSelectedVariant(null);
    }
  };

  const addVariant = async () => {
    if (!selectedTemplate) return;

    // Get the default variant's content
    const defaultVariant: any = await getDefaultVariant(selectedTemplate.id);
    const defaultContent = defaultVariant?.content || "";

    const name = `Variant ${variants.length}`;

    const newVariant = await createVariant(
      user?.id,
      selectedTemplate.id,
      defaultContent, // Use default variant's content instead of selected variant
      null,
      name || "New Variant",
      false // Not a default variant
    );

    setVariants([...variants, newVariant]);
    setSelectedVariant(newVariant.id);
    setIsEditing(true);
  };

  const handleMakeVariantDefault = async (variantId: string) => {
    if (!selectedTemplate) return;

    try {
      await makeVariantDefault(selectedTemplate.id, variantId);

      // Update local state
      setVariants((prev) =>
        prev.map((variant) => ({
          ...variant,
          isDefault: variant.id === variantId,
        }))
      );

      // Re-sort variants to ensure default is first
      setVariants((prev) =>
        [...prev].sort((a, b) => {
          if (a.isDefault && !b.isDefault) return -1;
          if (!a.isDefault && b.isDefault) return 1;
          return 0;
        })
      );
    } catch (error) {
      console.error("Error making variant default:", error);
    }
  };

  const clearAllVariables = () => {
    const textVariables = getCurrentVariables();
    const clearedVariables: Record<string, string> = {};

    // Keep text variables but clear their values
    textVariables.forEach((varName: any) => {
      clearedVariables[varName] = "";
    });

    setVariables(clearedVariables);

    // Update Firestore to remove all saved variables
    if (selectedTemplate) {
      debouncedUpdateTemplateVariables(selectedTemplate.id, {});

      // Update local template state
      setSelectedTemplate((prev: any) => ({
        ...prev,
        variables: {},
      }));

      // Update templates array
      setTemplates((prev: any) =>
        prev.map((template: any) =>
          template.id === selectedTemplate.id
            ? { ...template, variables: {} }
            : template
        )
      );
    }
  };

  const currentVariables = getCurrentVariables();
  const hasVariables = Object.keys(variables).length > 0;

  return (
    <div className="text-text min-h-screen font-sans">
      <div className="flex gap-3 h-screen p-3">
        {/* Sidebar */}
        <Sidebar
          templates={templates}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          addNewTemplate={addNewTemplate}
          deleteTemplate={deleteTemplate}
          selectedVariantData={selectedVariantData}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {selectedTemplate ? (
            <>
              <div className="flex flex-1">
                <div className="flex flex-col flex-1 py-2 px-3 overflow-auto bg-bg-secondary rounded-2xl border border-border">
                  <TemplateHeader
                    variants={variants}
                    selectedTemplate={selectedTemplate}
                    currentVariables={currentVariables}
                    template={selectedTemplate}
                    hasVariables={hasVariables}
                    showVariableEditor={showVariableEditor}
                    setShowVariableEditor={setShowVariableEditor}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    addVariant={addVariant}
                  />
                  <VariantsTabs
                    variants={variants}
                    selectedVariant={selectedVariant}
                    setSelectedVariant={setSelectedVariant}
                    addVariant={addVariant}
                    handleMakeVariantDefault={handleMakeVariantDefault}
                  />
                  <VariantContent
                    selectedVariant={selectedVariant}
                    setSelectedVariant={setSelectedVariant}
                    isEditing={isEditing}
                    variants={variants}
                    setVariants={setVariants}
                    variables={variables}
                    replaceVariables={replaceVariables}
                    copyToClipboard={copyToClipboard}
                    copiedId={copiedId}
                    selectedVariantData={selectedVariantData}
                    selectedTemplate={selectedTemplate}
                    currentVariables={currentVariables}
                    hasVariables={hasVariables}
                    showVariableEditor={showVariableEditor}
                    setShowVariableEditor={setShowVariableEditor}
                    setIsEditing={setIsEditing}
                    addVariant={addVariant}
                  />
                </div>

                {showVariableEditor && hasVariables && (
                  <VariableEditor
                    currentVariables={Object.keys(variables)}
                    variables={variables}
                    setVariables={setVariables}
                    handleVariableChange={handleVariableChange}
                    clearAllVariables={clearAllVariables}
                    selectedTemplate={selectedTemplate}
                    isEditing={isEditing}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
              <FileText size={48} className="mb-4" />
              <h3 className="m-0 text-xl font-medium mb-2">
                Select a template to get started
              </h3>
              <p className="m-0 text-lg text-center">
                Choose a template from the sidebar or create a new one
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Templates;
