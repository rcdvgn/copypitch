// app/templates/[templateId]/layout.tsx
"use client";

import React from "react";
import { useAuth } from "@/app/_contexts/AuthContext";
import { useRouter } from "next/navigation";
import { TemplateProvider } from "@/app/_contexts/TemplateContext";

const TemplateLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!user) {
      router.push("/signin");
    } else if (!user.onboarded) {
      router.push("/onboarding");
    }
  }, [user]);

  if (!user || !user.onboarded) {
    return null;
  }

  return <TemplateProvider>{children}</TemplateProvider>;
};

export default TemplateLayout;
