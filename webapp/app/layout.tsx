import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SyncNow | Telepathy Training",
  description: "Un esperimento serio di comunicazione non verbale e telepatia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${outfit.variable} ${inter.variable}`}>
      <body>
        <div className="bg-radial-gradient" />
        {children}
      </body>
    </html>
  );
}
