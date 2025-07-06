"use client";

import React, { createContext, useContext, useState } from "react";
import CreateTemplate from "../_components/modals/CreateTemplate";
import ModalContainer from "../_components/containers/ModalContainer";

// Types
interface ModalConfig {
  component: React.ComponentType<any>;
  allowDuplicate: boolean;
  closeOnOutsideClick: boolean;
}

interface ModalInstance {
  id: string;
  modalName: string;
  component: React.ReactElement;
  closeOnOutsideClick: boolean;
  closeItself: () => void;
  data?: any;
}

interface ModalContextType {
  modalStack: ModalInstance[];
  addModal: (modalName: string, data?: any) => void;
  removeModal: (modalId: string) => void;
  clearAllModals: () => void;
  isModalOpen: (modalName: string) => boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modalStack, setModalStack] = useState<ModalInstance[]>([]);

  const modals: Record<string, ModalConfig> = {
    createTemplate: {
      component: CreateTemplate,
      allowDuplicate: false,
      closeOnOutsideClick: true,
    },
  };

  const addModal = (modalName: string, data?: any) => {
    const modalConfig = modals[modalName];
    if (!modalConfig) {
      console.error(`Modal "${modalName}" not found in modal configuration`);
      return;
    }

    // Check allowDuplicate - only relevant for addModal function
    const existingModal = modalStack.find(
      (modal) => modal.modalName === modalName
    );
    if (existingModal && !modalConfig.allowDuplicate) {
      console.warn(
        `Modal "${modalName}" already exists and duplicates are not allowed`
      );
      return;
    }

    // Generate unique ID for every modal added to the stack
    const modalId = `${modalName}-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const ModalComponent = modalConfig.component;

    const closeHandler = () => removeModal(modalId);

    const newModal: ModalInstance = {
      id: modalId,
      modalName,
      component: (
        <ModalComponent key={modalId} data={data} closeItself={closeHandler} />
      ),
      closeOnOutsideClick: modalConfig.closeOnOutsideClick, // For ModalContainer
      closeItself: closeHandler,
      data,
    };

    setModalStack((curr) => [...curr, newModal]);
  };

  const removeModal = (modalId: string) => {
    setModalStack((curr) => curr.filter((modal) => modal.id !== modalId));
  };

  const clearAllModals = () => {
    setModalStack([]);
  };

  const isModalOpen = (modalName: string) => {
    return modalStack.some((modal) => modal.modalName === modalName);
  };

  const contextValue: ModalContextType = {
    modalStack,
    addModal,
    removeModal,
    clearAllModals,
    isModalOpen,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      <ModalContainer modalStack={modalStack} />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
