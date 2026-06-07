import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Saytica Eval Console",
    template: "%s | Saytica Eval Console",
  },
  description: "Professional AI Model Evaluation & Task Management Dashboard",
  keywords: ["AI", "Model Evaluation", "Task Management", "Leaderboard"],
  authors: [{ name: "Saytica" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen font-sans">
        <ThemeProvider>
          <QueryProvider>
            <div className="flex h-screen overflow-hidden bg-background">
              <AppSidebar />
              <div className="flex flex-1 flex-col overflow-hidden">
                <AppHeader />
                <main
                  className="flex-1 overflow-y-auto"
                  id="main-content"
                  role="main"
                >
                  {children}
                </main>
              </div>
            </div>
            <Toaster richColors position="bottom-right" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
