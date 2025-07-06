"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import OutsideClickWrapper from "../wrappers/OutsideClickWrapper";

// Import the types from your modal context
interface ModalInstance {
  id: string;
  modalName: string;
  component: React.ReactElement;
  closeOnOutsideClick: boolean;
  closeItself: () => void;
  data?: any;
}

interface ModalContainerProps {
  modalStack: ModalInstance[];
}

const ModalContainer: React.FC<ModalContainerProps> = ({ modalStack }) => {
  // Get the top modal (last in stack)
  const currentModal = modalStack[modalStack.length - 1];

  return (
    <AnimatePresence>
      {modalStack.length > 0 && currentModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="z-50 h-screen w-screen fixed top-0 left-0 bg-background/10 backdrop-blur-sm flex justify-center items-center"
        >
          <OutsideClickWrapper
            onOutsideClick={currentModal.closeItself}
            exceptionRefs={[]}
            isActive={currentModal.closeOnOutsideClick}
          >
            <div className="">{currentModal.component}</div>
          </OutsideClickWrapper>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalContainer;
