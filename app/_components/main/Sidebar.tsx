// _components/main/Sidebar.tsx
import { Plus } from "lucide-react";
import TemplateList from "../templateEditor/TemplateList";
import { useModal } from "@/app/_contexts/ModalContext";
import { useTemplateContext } from "@/app/_contexts/TemplateContext";

const Sidebar = () => {
  const {
    templates,
    currentTemplate,
    createNewTemplate,
    deleteTemplate,
    selectTemplate,
  } = useTemplateContext();
  const { addModal } = useModal();

  return (
    <div className="w-[260px] flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary mb-4">CopyPitch</h1>
        <button
          onClick={() =>
            addModal("createTemplate", { onCreateTemplate: createNewTemplate })
          }
          className="w-full py-2.5 px-4 bg-primary text-white rounded-md font-medium flex items-center justify-center gap-2 text-sm"
        >
          <Plus size={16} />
          New Template
        </button>
      </div>
      <TemplateList />
    </div>
  );
};

export default Sidebar;
