"use client";
import { useEffect, useRef } from "react";

function OutsideClickWrapper({
  children,
  onOutsideClick,
  exceptionRefs = [],
  isActive = true,
}: any) {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (!isActive) return;

    function handleClickOutside(event: any) {
      // Check if the click is outside the main ref
      if (ref.current && !ref.current.contains(event.target)) {
        // Also check if the click is outside all exception refs
        const isOutsideExceptions = exceptionRefs.every(
          (exceptionRef: any) =>
            exceptionRef.current && !exceptionRef.current.contains(event.target)
        );

        if (isOutsideExceptions) {
          onOutsideClick();
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isActive, onOutsideClick, exceptionRefs]);

  return <div ref={ref}>{children}</div>;
}

export default OutsideClickWrapper;
