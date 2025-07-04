"use client";

import { useAuth } from "@/app/_contexts/AuthContext";
import React from "react";

export default function Signup() {
  const { googleLogin } = useAuth();

  return (
    <div className="h-full w-full grid place-items-center">
      <button
        onClick={googleLogin}
        className="text-text bg-bg-secondary h-12 px-4 rounded-xl cursor-pointer"
      >
        Continue with Google
      </button>
    </div>
  );
}
