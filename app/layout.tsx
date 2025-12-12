import { Inter } from "next/font/google";
import { AppConfig } from "@/config/app.config";
import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ReduxProvider } from "@/src/redux/provider";
 
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: AppConfig().app.name,
  description: AppConfig().app.slogan,
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </ReduxProvider>
      </body>
    </html>
  );
}
