import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ClientLayout } from "@/components/ClientLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lash Beauty Shop — Produtos Premium para Cílios e Sobrancelhas",
  description: "Beleza que transforma o olhar. Produtos premium para cílios e sobrancelhas. Sofisticação e qualidade em cada detalhe.",
  icons: {
    icon: "/logo-brand.png",
    apple: "/logo-brand.png",
  },
  openGraph: {
    title: "Lash Beauty Shop — Boutique Premium",
    description: "Beleza que transforma o olhar. Sofisticação e qualidade em cada detalhe.",
    url: "https://lashbeautyshop.vercel.app",
    siteName: "Lash Beauty Shop",
    images: [
      {
        url: "/logo-brand.png",
        width: 1024,
        height: 1024,
        alt: "Lash Beauty Shop",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lash Beauty Shop — Boutique Premium",
    description: "Beleza que transforma o olhar. Sofisticação e qualidade em cada detalhe.",
    images: ["/logo-brand.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        <CartProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </CartProvider>
      </body>
    </html>
  );
}
