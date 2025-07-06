"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_contexts/AuthContext";

const PrivateLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  const [letUserIn, setLetUserIn] = useState(false);

  useEffect(() => {
    if (user) {
      if (!user?.onboarded) {
        router.push("/onboarding");
      } else {
        setLetUserIn(true);
      }
    } else {
      router.push("/signin");
    }
  }, [user]);

  return (
    <>
      {letUserIn ? (
        <div id="main" className="">
          {children}
        </div>
      ) : null}
    </>
  );
};

export default PrivateLayout;
