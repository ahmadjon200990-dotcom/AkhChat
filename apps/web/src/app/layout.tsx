import type { Metadata } from "next";
import type { ReactNode } from "react";
import AuthSessionProvider from "@/components/providers/session-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "AkhChat",
  description: "Random video chat platform",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="uz">
      <body>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}