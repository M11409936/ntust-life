import type { Metadata, Viewport } from "next";
import "./globals.css";
import TabBar from "@/components/TabBar";
import RegisterSW from "@/components/RegisterSW";

export const metadata: Metadata = {
  title: "台科日常",
  description: "台科大學生的校園生活小幫手：課表、交通、學餐、建築與行事曆。",
  appleWebApp: { capable: true, title: "台科日常", statusBarStyle: "default" },
  icons: { icon: "/icon.svg", apple: "/icon-192.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef2f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0d171c" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Chiron+GoRound+TC:wght@500;700&family=Noto+Sans+TC:wght@400;500;700&family=IBM+Plex+Mono:wght@500&display=swap"
        />
      </head>
      <body>
        <main className="app">{children}</main>
        <TabBar />
        <RegisterSW />
      </body>
    </html>
  );
}
