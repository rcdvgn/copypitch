// _components/templateEditor/TemplateList.tsx
import { Trash2 } from "lucide-react";
import { useTemplateContext } from "@/app/_contexts/TemplateContext";

const TemplateList = () => {
  const { templates, currentTemplate, deleteTemplate, selectTemplate } =
    useTemplateContext();

  return (
    <div className="flex-1 overflow-auto">
      {templates.map((template: any) => (
        <div
          key={template.id}
          onClick={() => selectTemplate(template.id)}
          className={`px-5 py-4 border-b border-border cursor-pointer ${
            currentTemplate?.id === template.id
              ? "bg-bg-tertiary border-l-4 border-primary"
              : "border-l-4 border-transparent"
          }`}
        >
          <div className="flex justify-between items-start">
            <h3 className="m-0 text-base font-medium text-text">
              {template.title}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteTemplate(template.id);
              }}
              className="bg-none border-none text-text-muted cursor-pointer p-1"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateList;
