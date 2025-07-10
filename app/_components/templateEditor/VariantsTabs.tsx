// _components/templateEditor/VariantsTabs.tsx
import { Plus, Star, MoreHorizontal } from "lucide-react";
import { useTemplateContext } from "@/app/_contexts/TemplateContext";
import { useState, useEffect } from "react";

const VariantsTabs = () => {
  const {
    variants,
    currentVariant,
    selectVariant,
    addVariant,
    makeVariantDefault,
  } = useTemplateContext();

  const [showContextMenu, setShowContextMenu] = useState<string | null>(null);

  useEffect(() => {
    // optionally handle side effects
  }, [variants, currentVariant]);

  const handleContextMenu = (e: React.MouseEvent, variantId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setShowContextMenu(variantId);
  };

  const handleMakeDefault = (variantId: string) => {
    makeVariantDefault(variantId);
    setShowContextMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = () => setShowContextMenu(null);
    if (showContextMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showContextMenu]);

  return (
    <div className="mb-3">
      <div className="flex items-center w-full">
        {variants &&
          variants.map((variant: any, index: any) => {
            const nextIsSelected =
              variants[index + 1]?.id === currentVariant?.id;
            const isLast = variants.length - 1 === index;
            return (
              <div
                key={variant?.id}
                className={`flex grow items-center relative ${
                  currentVariant?.id === variant?.id
                    ? "!max-w-[160px]"
                    : "!max-w-[140px]"
                }`}
              >
                <button
                  onClick={() => selectVariant(variant.id)}
                  onContextMenu={(e) => handleContextMenu(e, variant.id)}
                  className={`text-left grow px-3 h-8 rounded-xl text-[13px] font-medium cursor-pointer truncate transition-all duration-100 ease-in-out flex items-center gap-1 ${
                    currentVariant?.id === variant?.id
                      ? "bg-bg-tertiary text-text"
                      : "text-text-secondary hover:bg-bg-hover"
                  }`}
                >
                  {variant?.isDefault && (
                    <Star
                      size={12}
                      className="text-yellow-500 fill-yellow-500 shrink-0"
                    />
                  )}
                  <span className="truncate">{variant?.name}</span>
                </button>
                {showContextMenu === variant.id && (
                  <div className="absolute top-full left-0 mt-1 bg-bg-tertiary border border-border rounded-lg shadow-lg z-10 py-1 min-w-[120px]">
                    {!variant.isDefault && (
                      <button
                        onClick={() => handleMakeDefault(variant.id)}
                        className="w-full px-3 py-2 text-left text-sm text-text hover:bg-bg-hover flex items-center gap-2"
                      >
                        <Star size={12} />
                        Make Default
                      </button>
                    )}
                    {variant.isDefault && (
                      <div className="px-3 py-2 text-sm text-text-muted flex items-center gap-2">
                        <Star
                          size={12}
                          className="text-yellow-500 fill-yellow-500"
                        />
                        Default Variant
                      </div>
                    )}
                  </div>
                )}
                <span
                  className={`h-5 w-0.5 rounded-full shrink-0 ${
                    currentVariant?.id === variant?.id ||
                    nextIsSelected ||
                    isLast
                      ? ""
                      : "bg-border"
                  }`}
                ></span>
              </div>
            );
          })}
        <button onClick={addVariant} className="icon-button-sm">
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default VariantsTabs;
