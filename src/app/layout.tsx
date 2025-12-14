import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Bitter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Display font - Headlines, buttons, bold statements
const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
  display: "swap",
});

// Body font - Readable serif for legal content
const bitter = Bitter({
  weight: ["400", "500", "600", "700"],
  variable: "--font-bitter",
  subsets: ["latin"],
  display: "swap",
});

// Code font - Legal citations, stats, monospace elements
const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1A1A1D",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: "Poder | Know Your Rights",
  description:
    "Reclaiming rights, empowering people. An educational platform that helps you understand and assert your legal rights through interactive learning.",
  keywords: [
    "rights",
    "legal education",
    "immigration rights",
    "tenant rights",
    "civil rights",
    "know your rights",
  ],
  authors: [{ name: "Performative People" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Poder",
  },
  openGraph: {
    type: "website",
    title: "Poder | Know Your Rights",
    description: "Reclaiming rights, empowering people.",
    siteName: "Poder",
  },
};

import { PoderAgent } from "@/components/poder-agent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${bebasNeue.variable} ${bitter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
        <PoderAgent />
      </body>
    </html>
  );
}
