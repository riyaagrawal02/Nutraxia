import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppThemeProvider from "./providers/ThemeProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nutraxia",
  description: "AI-powered health & wellness assistant",
  icons:{
    icon:"/nutraxia.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="transition-colors duration-300">
        <AppThemeProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-gray-100">
            {children}
          </div>
        </AppThemeProvider>
      </body>
    </html>
  );
}
