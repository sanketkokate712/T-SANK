import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

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
  title: "T-SANK — Premium Transformers Merchandise",
  description:
    "Premium Transformers t-shirts and merchandise by Sanket Kokate. Shop Autobots, Decepticons and classic designs.",
  openGraph: {
    title: "T-SANK — Premium Transformers Merchandise",
    description:
      "Scroll-driven cinematic direction. Premium Transformers merch for fans.",
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
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
