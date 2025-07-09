// VariantContent.tsx
import { useEffect, useCallback } from "react";
import { Copy } from "lucide-react";
import { useTemplateUpdates } from "@/app/_utils/templateEditorUtils";
import VariantsTabs from "./VariantsTabs";
import TemplateHeader from "./TemplateHeader";

const VariantContent = ({
  selectedVariant,
  setSelectedVariant,
  isEditing,
  variants,
  setVariants,
  variables,
  replaceVariables,
  copyToClipboard,
  copiedId,
  selectedVariantData,

  selectedTemplate,
  currentVariables,
  hasVariables,
  showVariableEditor,
  setShowVariableEditor,
  setIsEditing,
  addVariant,
}: any) => {
  const { debouncedUpdateVariant } = useTemplateUpdates();

  // Update Firestore when variant content changes
  useEffect(() => {
    if (
      selectedVariant &&
      selectedVariantData?.content !== undefined &&
      isEditing
    ) {
      debouncedUpdateVariant(selectedVariant, selectedVariantData.content);
    }

    return () => {
      debouncedUpdateVariant.cancel();
    };
  }, [
    selectedVariantData?.content,
    selectedVariant,
    isEditing,
    debouncedUpdateVariant,
  ]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isEditing && selectedVariantData) {
      const newContent = e.target.value;

      // Update the variants array with the new content
      const updatedVariants = variants.map((variant: any) =>
        variant.id === selectedVariant
          ? { ...variant, content: newContent }
          : variant
      );

      setVariants(updatedVariants);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedUpdateVariant.cancel();
    };
  }, [debouncedUpdateVariant]);

  return (
    <div className="bg-bg-tertiary w-full flex-1 max-w-[1000px]">
      {selectedVariantData && (
        <div>
          <textarea
            value={
              isEditing
                ? selectedVariantData.content || ""
                : replaceVariables(selectedVariantData.content, variables)
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
