import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GhostShield AI — Digital Threat Analysis",
  description: "Understand suspicious messages and links with clear, practical safety guidance.",
  applicationName: "GhostShield AI"
};

export const viewport: Viewport = {
  themeColor: "#070b0d",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
