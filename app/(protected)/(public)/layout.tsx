"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_contexts/AuthContext";

const PublicLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/t");
    }
  }, [user, router]);

  return <>{!user ? children : null}</>;
};

export default PublicLayout;
