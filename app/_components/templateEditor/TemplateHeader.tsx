import { Edit2, Plus, Variable } from "lucide-react";

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
}: any) => (
  <div className="px-8 py-6 border-b border-border bg-bg-secondary">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="m-0 text-xl font-semibold mb-2">{template.title}</h2>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-text-secondary bg-bg-tertiary px-2 py-1 rounded">
            {selectedTemplate.category}
          </span>
          <span className="text-sm text-text-muted">
            {variants.length} variant
            {variants.length !== 1 ? "s" : ""}
          </span>
          {hasVariables && (
            <span className="text-sm text-accent bg-bg-tertiary px-2 py-1 rounded flex items-center gap-1">
              <Variable size={12} />
              {currentVariables.length} variable
              {currentVariables.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setShowVariableEditor((v: any) => !v)}
          disabled={!hasVariables}
          className={`px-4 py-2 rounded-md text-sm flex items-center gap-1 ${
            hasVariables
              ? showVariableEditor
                ? "bg-accent text-white"
                : "bg-bg-tertiary text-text"
              : "bg-border text-text-muted cursor-not-allowed"
          }`}
        >
          <Variable size={14} />
          Variables
        </button>
        <button
          onClick={() => setIsEditing((v: any) => !v)}
          className={`px-4 py-2 rounded-md text-sm flex items-center gap-1 ${
            isEditing ? "bg-success text-white" : "bg-bg-tertiary text-text"
          }`}
        >
          <Edit2 size={14} />
          {isEditing ? "Save" : "Edit"}
        </button>
        <button
          onClick={addVariant}
          className="px-4 py-2 rounded-md text-sm flex items-center gap-1 bg-primary text-white"
        >
          <Plus size={14} />
          Add Variant
        </button>
      </div>
    </div>
  </div>
);

export default TemplateHeader;
