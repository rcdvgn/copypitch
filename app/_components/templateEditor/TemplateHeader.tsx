import { Variable, Edit2, Eye, Plus, Copy } from "lucide-react";

const TemplateHeader = ({
  variants,
  selectedTemplate,
  currentVariables,
  template,
  hasVariables,
  showVariableEditor,
  setShowVariableEditor,
  isEditing,
  setIsEditing,
  addVariant,
}: any) => {
  return (
    <div className="px-1">
      <div className="flex items-center justify-between w-full mb-2">
        <div className="text-base font-medium">
          <span className="text-text-secondary">
            {selectedTemplate.category}
          </span>
          <span className="text-text-muted"> / </span>
          <span className="text-text">{template.title}</span>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => setShowVariableEditor((v: any) => !v)}
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
            onClick={() => setIsEditing((v: any) => !v)}
            className={`icon-button-sm`}
          >
            {isEditing ? <Eye size={16} /> : <Edit2 size={16} />}
          </button>

          <button
            onClick={() => {
              /* TODO: Implement copy functionality */
            }}
            className="icon-button-sm"
          >
            <Copy size={16} />
          </button>
        </div>
      </div>

      {/* <div className="flex gap-2 items-center">
        <span className="text-sm text-text-muted">
          {variants.length} variant
          {variants.length !== 1 ? "s" : ""}
        </span>
        {hasVariables && (
          <span className="text-sm text-text-secondary bg-bg-tertiary px-2 py-1 rounded flex items-center gap-1">
            <Variable size={12} />
            {currentVariables.length} variable
            {currentVariables.length !== 1 ? "s" : ""}
          </span>
        )}
      </div> */}
    </div>
  );
};

export default TemplateHeader;
