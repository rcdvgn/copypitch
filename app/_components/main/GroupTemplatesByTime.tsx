// _components/templateEditor/GroupTemplatesByTime.tsx
import { useTemplateContext } from "@/app/_contexts/TemplateContext";
import { capitalizeFirstLetter } from "@/app/_utils/capitalizeFirstLetter";
import { groupTemplatesByTime } from "@/app/_utils/groupTemplatesByTime";
import React from "react";

interface Template {
  id: string;
  title: string;
  name: string;
  category: string;
  variables: Record<string, string>;
  variantIds: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface GroupTemplatesByTimeProps {
  templates: Template[];
  children: (template: Template, index: number) => React.ReactNode;
}

export const GroupTemplatesByTime: React.FC<GroupTemplatesByTimeProps> = ({
  templates,
  children,
}) => {
  const { isFullView } = useTemplateContext();
  const organizedTemplates = groupTemplatesByTime(templates, "updatedAt");

  return (
    <div className="flex flex-col gap-4 overflow-y-auto grow overflow-x-hidden">
      {Object.entries(organizedTemplates).map(([timeSlot, group]: any) => (
        <div className="flex flex-col" key={timeSlot}>
          <span
            className={`block font-bold text-[11px] text-text-muted mb-2 ${
              isFullView ? "text-center" : "text-left px-3"
            }`}
          >
            {capitalizeFirstLetter(timeSlot)}
          </span>

          <div className="flex flex-col gap-1">
            {group.map((template: Template, index: number) => (
              <div key={template.id}>{children(template, index)}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
