// _components/main/Sidebar.tsx
import { Plus, Search, SquarePen } from "lucide-react";
import TemplateList from "../templateEditor/TemplateList";
import { useModal } from "@/app/_contexts/ModalContext";
import { useTemplateContext } from "@/app/_contexts/TemplateContext";
import { NewTemplateIcon } from "../assets/icons";

const Sidebar = () => {
  const { createNewTemplate, isFullView } = useTemplateContext();
  const { addModal } = useModal();

  return (
    <div
      className={`flex flex-col gap-3 overflow-hidden transition-all duration-200 ease-in-out ${
        isFullView ? "w-10" : "w-[250px]"
      }`}
    >
      {isFullView ? (
        <div
          // onClick={() =>
          // }
          className="sidebar-item-square border-transparent hover:bg-bg-hover"
        >
          <Search size={16} />
        </div>
      ) : (
        <button className="button-1 !text-text-muted !justify-start !text-sm !bg-bg-secondary hover:!bg-bg-tertiary">
          <Search size={16} />
          Search
        </button>
      )}

      <div
        onClick={() =>
          addModal("createTemplate", { onCreateTemplate: createNewTemplate })
        }
        className={`${
          isFullView ? "sidebar-item-square" : "sidebar-item"
        } border-transparent hover:bg-bg-hover`}
      >
        <NewTemplateIcon className={isFullView ? "h-4" : "h-[15px]"} />
        {!isFullView && "New Template"}
      </div>

      <TemplateList />
    </div>
  );
};

export default Sidebar;
