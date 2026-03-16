import "./globals.css";
import { ReactNode } from "react";
import { ChunkReloadHandler } from "@/components/chunk-reload-handler";

export const metadata = {
  title: "Modular CMS Starter",
  description: "Structured CMS starter for agency/client delivery.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ChunkReloadHandler />
        {children}
      </body>
    </html>
  );
}
