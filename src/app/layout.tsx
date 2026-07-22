import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Efe Hakkı Polat | Attaquant · Buteur",
  description: "Le parcours et les ambitions d'Efe Hakkı Polat, attaquant franco-turc.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
