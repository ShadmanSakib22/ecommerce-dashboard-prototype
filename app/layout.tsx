import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Shopping Dashboard Prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        cssLayerName: "clerk",
      }}
    >
      <html lang="en">
        <body className={`${poppins.variable} ${roboto.variable} antialiased`}>
          <Navbar />
          <Toaster
            position="bottom-center"
            reverseOrder={false}
            toastOptions={{
              className:
                "bg-background! text-primary! border-1 border-primary! text-sm! md:text-base!",
              duration: 3500,
            }}
          />
          <div className="min-h-screen">{children}</div>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
