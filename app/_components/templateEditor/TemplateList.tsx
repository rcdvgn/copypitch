import { Trash2 } from "lucide-react";

const TemplateList = ({
  templates,
  selectedTemplate,
  setSelectedTemplate,
  deleteTemplate,
  selectedVariantData,
}: any) => (
  <div className="flex-1 overflow-auto">
    {templates.map((template: any) => (
      <div
        key={template.id}
        onClick={() => setSelectedTemplate(template)}
        className={`px-5 py-4 border-b border-border cursor-pointer ${
          selectedTemplate?.id === template.id
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

export default TemplateList;
