import { Darker_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/ui/header";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";


const inter = Inter({subsets: ["latin"]});

export const metadata = {
  title: "Healthcare Platform",
  description: "Connect anytime,anywhere",
};

export default function RootLayout({ children }) {
  return (    
    <ClerkProvider 
      appearance={{
        baseTheme: dark
        }}
    >
  
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
             {/* header */}
             <Header />
         
         {/* main */}

        <main className="min-h-screen">{children}</main>
        <Toaster richColors />

        {/* footer */}
        <footer className="bg-muted/50 py-12">
          <div className="container mx-auto px-4 text-center text-gray-800">
            <p>MADE BY S</p>
          </div>
        </footer>
          </ThemeProvider>
       
      </body>
    </html>
    </ClerkProvider>
  );
}
