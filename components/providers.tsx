"use client";
import { ThemeProvider } from "next-themes";
import { SessionProvider as NextauthSessionProvider } from "next-auth/react";
import { SessionProvider as CustomSessionProvider } from "@/lib/contexts/session-context";
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextauthSessionProvider>
      <CustomSessionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </CustomSessionProvider>
    </NextauthSessionProvider>
  );
};
