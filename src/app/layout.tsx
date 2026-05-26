import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Toaster } from "react-hot-toast";
import { getSession } from "@/lib/session";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Hally's Way Concept — Tea Blends, Spices & Wellness",
    template: "%s · Hally's Way Concept"
  },
  description:
    "Discover hand-mixed herbal tea blends, signature spices and wellness essentials by Hally's Way Concept — proudly crafted in Nigeria.",
  metadataBase: new URL("https://hallysway.com"),
  openGraph: {
    title: "Hally's Way Concept",
    description: "Tea blends, spices and wellness — naturally crafted.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const session = getSession();
  const user = session ? { name: session.name, email: session.email } : null;
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-brand-cream text-brand-navy antialiased selection:bg-brand-navy selection:text-white">
        <Providers>
          <Navbar user={user} />
          <main className="relative">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppButton />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#0d1b35",
                color: "#fff",
                borderRadius: "12px",
                padding: "12px 16px"
              }
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
