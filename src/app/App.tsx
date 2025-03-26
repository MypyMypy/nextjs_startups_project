"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "../shared/ui/Toaster";

export const App: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      {children}
      <Toaster />
    </SessionProvider>
  );
};
