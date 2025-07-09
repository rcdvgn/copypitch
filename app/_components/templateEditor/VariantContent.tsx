// _components/templateEditor/VariantContent.tsx
import React, { useEffect } from "react";
import { useTemplateContext } from "@/app/_contexts/TemplateContext";
import { replaceVariables } from "@/app/_utils/templateEditorUtils";

const VariantContent = () => {
  const { currentVariant, isEditing, variables, updateVariantContent } =
    useTemplateContext();

  // useEffect(() => {
  // Sync with backend if necessary
  // }, [currentVariant, isEditing]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isEditing && currentVariant) {
      updateVariantContent(e.target.value);
    }
  };

  return (
    <div className="w-full flex-1 text-center">
      {currentVariant && (
        <textarea
          value={
            isEditing
              ? currentVariant.content || ""
              : replaceVariables(currentVariant.content, variables)
          }
          onChange={handleContentChange}
          readOnly={!isEditing}
          className={`max-w-[1000px] w-full h-full p-4 border-none outline-none rounded-lg text-base leading-relaxed resize-none font-sans ${
            isEditing ? "" : ""
          } text-text`}
        />
      )}
    </div>
  );
};

export default VariantContent;
