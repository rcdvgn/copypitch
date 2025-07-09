// _components/templateEditor/TemplateList.tsx
import { useTemplateContext } from "@/app/_contexts/TemplateContext";
import { GroupTemplatesByTime } from "../main/GroupTemplatesByTime";
import { ScriptIcon } from "../assets/icons";

const TemplateList = () => {
  const { templates, currentTemplate, selectTemplate, isFullView } =
    useTemplateContext();

  return (
    <div className="flex-1 overflow-auto">
      <GroupTemplatesByTime templates={templates}>
        {(template: any, index: number) => (
          <div
            key={template.id}
            onClick={() => selectTemplate(template.id)}
            className={`${
              isFullView ? "sidebar-item-square" : "sidebar-item"
            } ${
              currentTemplate?.id === template.id
                ? "bg-bg-tertiary border-border hover:border-border-hover !text-text"
                : "border-transparent hover:bg-bg-hover"
            }`}
          >
            <span className="">
              <ScriptIcon className={isFullView ? "h-4" : "h-[15px]"} />
            </span>
            {!isFullView && (
              <span className="m-0 text-[13px] font-medium">
                {template.name}
              </span>
            )}
          </div>
        )}
      </GroupTemplatesByTime>
    </div>
  );
};

export default TemplateList;
