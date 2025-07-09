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
    <div className="bg-bg-tertiary w-full flex-1 max-w-[1000px]">
      {currentVariant && (
        <div>
          <textarea
            value={
              isEditing
                ? currentVariant.content || ""
                : replaceVariables(currentVariant.content, variables)
            }
            onChange={handleContentChange}
            readOnly={!isEditing}
            className={`w-full h-full p-4 border-none outline-none rounded-lg text-base leading-relaxed resize-vertical font-sans ${
              isEditing ? "" : ""
            } text-text`}
          />
        </div>
      )}
    </div>
  );
};

export default VariantContent;
