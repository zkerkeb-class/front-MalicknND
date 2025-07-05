import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { UserCreditsProvider } from "@/context/UserCreditsContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Imagify - AI Image Generator",
  description: "Turn your text into beautiful images with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <UserCreditsProvider>
        <html lang="en">
          <body className={poppins.className}>
            <Header />
            <Toaster position="bottom-center" />
            {children}
            <Footer />
          </body>
        </html>
      </UserCreditsProvider>
    </ClerkProvider>
  );
}
