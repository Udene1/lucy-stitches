import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/hooks/useAuth";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lucy Stitches | Premium Tailoring",
  description: "Bespoke traditional and contemporary luxury fashion in Port Harcourt.",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#064e3b" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" />
          <PWAInstallPrompt />
        </AuthProvider>
      </body>
    </html>
  );
}
