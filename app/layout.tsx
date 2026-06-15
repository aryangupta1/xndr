import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://xndr.example"),
  title: "XNDR — Structural · Remedial · Project Management",
  description:
    "XNDR delivers structural engineering, remedial engineering and project management with precision and accountability.",
  icons: { icon: "/logo-mark.png" },
  openGraph: {
    title: "XNDR — Engineering certainty into every structure",
    description:
      "Structural engineering, remedial engineering and project management.",
    images: ["/logo-mark.png"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1c2023",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
