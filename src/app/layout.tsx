import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Rifat Rafiu — Materials Science & Engineering Researcher",
    template: "%s · Rifat Rafiu",
  },
  description:
    "Rifat Rafiu — computational materials scientist at KUET working on DFT, lead-free perovskites and next-generation solar cells. 20+ peer-reviewed publications.",
  keywords: [
    "Rifat Rafiu",
    "Materials Science",
    "DFT",
    "Perovskite Solar Cells",
    "KUET",
    "Computational Materials Science",
    "Photovoltaics",
  ],
  authors: [{ name: "Rifat Rafiu" }],
  openGraph: {
    title: "Rifat Rafiu — Materials Science & Engineering Researcher",
    description:
      "Computational materials scientist designing next-generation lead-free perovskites for clean, efficient solar energy.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
