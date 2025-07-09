// _components/templateEditor/VariableEditor.tsx
import { RotateCcw } from "lucide-react";
import { useTemplateContext } from "@/app/_contexts/TemplateContext";

const VariableEditor = () => {
  const { currentVariables, variables, updateVariable, clearAllVariables } =
    useTemplateContext();

  return (
    <div className="w-[350px] px-3 py-6 bg-bg-secondary border border-border ml-3 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="m-0 text-base font-medium text-accent">
          Template Variables
        </h3>
        <button
          onClick={clearAllVariables}
          className="px-3 py-1.5 rounded bg-warning text-white text-xs flex items-center gap-1"
        >
          <RotateCcw size={12} />
          Clear All
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {currentVariables.map((varName: any) => (
          <div key={varName}>
            <label className="block text-sm font-medium text-text mb-3">
              {varName}
            </label>
            <input
              type="text"
              value={variables[varName] || ""}
              onChange={(e) => updateVariable(varName, e.target.value)}
              placeholder={`Enter ${varName}`}
              className="input-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariableEditor;
