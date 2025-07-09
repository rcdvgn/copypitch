// _components/templateEditor/TemplateHeader.tsx
import { Variable, Edit2, Eye, Plus, Copy } from "lucide-react";
import { useTemplateContext } from "@/app/_contexts/TemplateContext";

const TemplateHeader = () => {
  const {
    currentTemplate,
    hasVariables,
    showVariableEditor,
    setShowVariableEditor,
    isEditing,
    setIsEditing,
  } = useTemplateContext();

  if (!currentTemplate) return null;

  return (
    <div className="px-1">
      <div className="flex items-center justify-between w-full mb-2">
        <div className="text-base font-medium">
          <span className="text-text-secondary">
            {currentTemplate.category}
          </span>
          <span className="text-text-muted"> / </span>
          <span className="text-text">{currentTemplate.title}</span>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => setShowVariableEditor(!showVariableEditor)}
            disabled={!hasVariables}
            className={`icon-button-sm ${
              hasVariables
                ? showVariableEditor
                  ? "!bg-bg-tertiary !text-text"
                  : ""
                : "opacity-80 cursor-not-allowed"
            }`}
          >
            <Variable size={16} />
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="icon-button-sm"
          >
            {isEditing ? <Eye size={16} /> : <Edit2 size={16} />}
          </button>
          <button
            onClick={() => {
              // TODO: Implement copy functionality
            }}
            className="icon-button-sm"
          >
            <Copy size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateHeader;
