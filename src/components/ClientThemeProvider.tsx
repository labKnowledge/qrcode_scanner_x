// components/ClientThemeProvider.tsx
"use client";

import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "../lib/theme";

interface ClientThemeProviderProps {
  children: React.ReactNode;
}

export default function ClientThemeProvider({
  children,
}: ClientThemeProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
