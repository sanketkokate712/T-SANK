import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cinematic Transformer Sequence",
  description:
    "A frame-by-frame cinematic transformation — a mechanical truck becomes a humanoid robot across 40 meticulously directed frames.",
  openGraph: {
    title: "Cinematic Transformer Sequence",
    description:
      "Scroll-driven cinematic direction. Frame-by-frame transformation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${orbitron.variable} ${rajdhani.variable} antialiased bg-base-dark text-white`}
      >
        {children}
      </body>
    </html>
  );
}
