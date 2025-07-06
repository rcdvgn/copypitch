import { RotateCcw } from "lucide-react";

const VariableEditor = ({
  currentVariables,
  variables,
  setVariables,
  clearAllVariables,
}: any) => (
  <div className="px-8 py-6 bg-bg-secondary border-b border-border">
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
    <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
      {currentVariables.map((varName: any) => (
        <div key={varName}>
          <label className="block text-sm font-medium text-text mb-1">
            {varName}
          </label>
          <input
            type="text"
            value={variables[varName] || ""}
            onChange={(e) =>
              setVariables({
                ...variables,
                [varName]: e.target.value,
              })
            }
            placeholder={`Enter ${varName}`}
            className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded text-text text-sm box-border"
          />
        </div>
      ))}
    </div>
  </div>
);

export default VariableEditor;
