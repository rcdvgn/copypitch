// VariantContent.tsx
import { useEffect, useCallback } from "react";
import { Copy } from "lucide-react";
import { useTemplateUpdates } from "@/app/_utils/templateEditorUtils";

const VariantContent = ({
  selectedVariant,
  isEditing,
  variants,
  setVariants,
  variables,
  replaceVariables,
  copyToClipboard,
  copiedId,
  selectedVariantData,
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
    <div className="flex-1 px-8 py-8 overflow-auto">
      {selectedVariantData && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="m-0 text-lg font-medium">
              {selectedVariantData.name}
            </h3>
            <button
              onClick={() =>
                copyToClipboard(
                  selectedVariantData.content,
                  selectedVariantData.id
                )
              }
              className={`px-4 py-2 rounded-md text-sm flex items-center gap-1 ${
                copiedId === selectedVariantData.id
                  ? "bg-success text-white"
                  : "bg-primary text-white"
              }`}
            >
              <Copy size={14} />
              {copiedId === selectedVariantData.id ? "Copied!" : "Copy"}
            </button>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-medium text-text-secondary">
              {isEditing ? "Template Editor" : "Preview"}
            </h4>
            <textarea
              value={
                isEditing
                  ? selectedVariantData.content || ""
                  : replaceVariables(selectedVariantData.content, variables)
              }
              onChange={handleContentChange}
              readOnly={!isEditing}
              className={`w-full h-[300px] p-4 border border-border rounded-lg text-base leading-relaxed resize-vertical font-sans ${
                isEditing ? "bg-bg-secondary" : "bg-bg-tertiary"
              } text-text`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VariantContent;
