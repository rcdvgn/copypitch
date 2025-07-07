// page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FileText } from "lucide-react";
import {
  createTemplate,
  createVariant,
  fetchTemplateVariants,
  fetchUserTemplates,
} from "@/app/_lib/db/templates";
import { useAuth } from "@/app/_contexts/AuthContext";
import VariantContent from "@/app/_components/templateEditor/VariantContent";
import VariableEditor from "@/app/_components/templateEditor/VariableEditor";
import TemplateHeader from "@/app/_components/templateEditor/TemplateHeader";
import Sidebar from "@/app/_components/main/Sidebar";
import {
  replaceVariables,
  useVariables,
} from "@/app/_utils/templateEditorUtils";
import VariantsTabs from "@/app/_components/templateEditor/VariantsTabs";

const Templates: React.FC = () => {
  const { user } = useAuth();

  // Core state
  const [templates, setTemplates] = useState<any>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [copiedId, setCopiedId] = useState<any>(null);
  const [showVariableEditor, setShowVariableEditor] = useState(false);

  // Variables state - now includes template variables
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

  // Update variables when variant changes or template ID changes
  useEffect(() => {
    if (selectedVariantData && selectedTemplate) {
      const currentVars = getCurrentVariables();
      const newVariables: Record<string, string> = {};

      // Start with template variables if they exist
      const templateVars = selectedTemplate.variables || {};

      // Merge with current variables from content
      currentVars.forEach((varName: any) => {
        newVariables[varName] =
          variables[varName] || templateVars[varName] || "";
      });

      // Only update if the variables actually changed
      const hasChanged =
        JSON.stringify(newVariables) !== JSON.stringify(variables);
      if (hasChanged) {
        setVariables(newVariables);
      }
    }
  }, [selectedVariant, selectedTemplate?.id, selectedVariantData?.content]);

  // Update selected template when variables change (for unified data structure)
  useEffect(() => {
    if (selectedTemplate && variables && Object.keys(variables).length > 0) {
      const updatedTemplate = {
        ...selectedTemplate,
        variables: variables,
      };

      // Only update if the template variables actually changed
      const hasChanged =
        JSON.stringify(selectedTemplate.variables) !==
        JSON.stringify(variables);
      if (hasChanged) {
        setSelectedTemplate(updatedTemplate);

        // Update in templates array
        setTemplates((prev: any) =>
          prev.map((t: any) =>
            t.id === selectedTemplate.id ? updatedTemplate : t
          )
        );
      }
    }
  }, [variables, selectedTemplate?.id]);

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
    await createVariant(user?.id, newTemplate.id, "");
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

    const newVariant = await createVariant(
      user?.id,
      selectedTemplate.id,
      selectedTemplate.content || ""
    );

    setVariants([...variants, newVariant]);
    setSelectedVariant(newVariant.id);
    setIsEditing(true);
  };

  const clearAllVariables = () => {
    const clearedVariables: Record<string, string> = {};
    getCurrentVariables().forEach((varName: any) => {
      clearedVariables[varName] = "";
    });
    setVariables(clearedVariables);
  };

  const currentVariables = getCurrentVariables();
  const hasVariables = currentVariables.length > 0;

  return (
    <div className="text-text min-h-screen font-sans">
      <div className="flex h-screen">
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

              {showVariableEditor && hasVariables && (
                <VariableEditor
                  currentVariables={currentVariables}
                  variables={variables}
                  setVariables={setVariables}
                  clearAllVariables={clearAllVariables}
                  selectedTemplate={selectedTemplate}
                  isEditing={isEditing}
                />
              )}

              <VariantsTabs
                variants={variants}
                selectedVariant={selectedVariant}
                setSelectedVariant={setSelectedVariant}
              />

              <VariantContent
                selectedVariant={selectedVariant}
                isEditing={isEditing}
                variants={variants}
                setVariants={setVariants}
                variables={variables}
                replaceVariables={replaceVariables}
                copyToClipboard={copyToClipboard}
                copiedId={copiedId}
                selectedVariantData={selectedVariantData}
              />
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
