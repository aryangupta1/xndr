import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { siteUrl } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
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
  // Apply the saved theme before first paint to avoid a flash. Defaults to dark.
  const noFlashScript = `(function(){try{var t=localStorage.getItem('xndr-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

  return (
    <html
      lang="en"
      className={inter.className}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
