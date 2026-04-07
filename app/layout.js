import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/ui/header";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";
import InstallButton from "@/components/InstallButton";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Healthcare Platform",
  description: "Connect anytime, anywhere",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* Header */}
            <Header />

            {/* Main */}
            <main className="min-h-screen">{children}</main>

            {/* Toast */}
            <Toaster richColors />

            {/* PWA Install Button */}
            <InstallButton />


            {/* Professional Footer */}
            <footer className="bg-muted/50 py-8">
              <div className="container mx-auto px-4 text-center space-y-2">
                {/* 1. Copyright */}
                <p className="font-semibold text-emerald-400">
                  © {new Date().getFullYear()} MedSync. All rights reserved.
                </p>

                {/* 2. Platform Description */}
                <p className="text-sm text-muted-foreground">
                  MedSync provides seamless virtual healthcare, connecting patients and doctors for consultations and appointments anytime, anywhere.
                </p>

                {/* 3. Contact Info */}
                <p className="text-sm text-muted-foreground">
                  Email: <span className="text-emerald-400">support@medsync.com</span> | Phone: <span className="text-emerald-400">+91 98765 43210</span>
                </p>

                {/* 4. Tagline */}
                <p className="text-xs text-muted-foreground">
                  Trusted digital healthcare platform.
                </p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}