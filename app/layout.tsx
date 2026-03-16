import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Modular CMS Starter",
  description: "Structured CMS starter for agency/client delivery.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
