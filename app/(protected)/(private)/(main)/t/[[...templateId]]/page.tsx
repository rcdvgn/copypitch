// app/t/[[...templateId]]/page.tsx
"use client";

import React from "react";
import Sidebar from "@/app/_components/main/Sidebar";
import TemplateHeader from "@/app/_components/templateEditor/TemplateHeader";
import VariantsTabs from "@/app/_components/templateEditor/VariantsTabs";
import VariantContent from "@/app/_components/templateEditor/VariantContent";
import VariableEditor from "@/app/_components/templateEditor/VariableEditor";
import { useTemplateContext } from "@/app/_contexts/TemplateContext";
import { FileText, AlertCircle } from "lucide-react";

const TemplateEditorPage: React.FC = () => {
  const {
    currentTemplate,
    currentTemplateId,
    templates,
    showVariableEditor,
    hasVariables,
  } = useTemplateContext();

  // Determine the state based on templateId and currentTemplate
  const getTemplateState = () => {
    if (!currentTemplateId) {
      return "no-template";
    }

    if (templates.length === 0) {
      return "loading"; // Templates are still being loaded
    }

    if (!currentTemplate) {
      return "invalid-template";
    }

    return "valid-template";
  };

  const templateState = getTemplateState();

  const renderEmptyState = () => {
    switch (templateState) {
      case "no-template":
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
            <FileText size={48} className="mb-4" />
            <h3 className="m-0 text-xl font-medium mb-2">
              Select a template to get started
            </h3>
            <p className="m-0 text-lg text-center">
              Choose a template from the sidebar or create a new one
            </p>
          </div>
        );

      case "invalid-template":
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
            <AlertCircle size={48} className="mb-4 text-red-500" />
            <h3 className="m-0 text-xl font-medium mb-2">Template not found</h3>
            <p className="m-0 text-lg text-center">
              The template you're looking for doesn't exist or has been deleted
            </p>
          </div>
        );

      case "loading":
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-text-muted mb-4"></div>
            <p className="m-0 text-lg text-center">Loading templates...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="text-text min-h-screen font-sans">
      <div className="flex gap-3 h-screen p-3">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {templateState === "valid-template" ? (
            <div className="flex flex-1">
              <div className="flex flex-col flex-1 py-2 px-3 overflow-auto bg-bg-secondary rounded-2xl border border-border focus-within:border-border-hover">
                <TemplateHeader />
                <VariantsTabs />
                <VariantContent />
              </div>

              {showVariableEditor && hasVariables && <VariableEditor />}
            </div>
          ) : (
            renderEmptyState()
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateEditorPage;
