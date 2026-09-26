import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HealthAssistantChatbot from "@/components/assistant/HealthAssistantChatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Care.bj | Plateforme Nationale e-Santé Bénin",
  description: "Plateforme numérique collaborative, souveraine et inclusive de suivi des soins au Bénin. Conçue pour tous les citoyens : assistance vocale en langues nationales, mode hors-ligne et accessibilité WCAG AAA.",
  keywords: ["e-santé", "Bénin", "santé numérique", "DMP", "télémédecine", "pharmacie de garde", "SAMU 112", "Care.bj", "ANIP", "AMU"],
  authors: [{ name: "Équipe e-Santé Bénin" }],
  icons: {
    icon: [
      { url: "/icon.svg?v=2", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg?v=2",
    apple: "/icon.svg?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/icon.svg?v=2" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg?v=2" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-teal-500 selection:text-white">
        {children}
        <HealthAssistantChatbot />
      </body>
    </html>
  );
}
