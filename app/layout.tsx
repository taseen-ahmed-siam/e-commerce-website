import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { CartProvider } from "@/components/cart-context"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-custom",
  display: "swap",
})

// Note: using a custom serif font via CSS variable `--font-serif-custom`
// The font face should be provided in CSS or via a hosted font.

export const metadata: Metadata = {
  title: "Techzo — Quietly crafted home objects",
  description:
    "Techzo is a premium home goods studio creating quietly crafted ceramics, lighting and textiles for considered interiors.",
  generator: "v0.app",
  openGraph: {
    title: "Techzo",
    description: "Quietly crafted home objects.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html lang="en" className={`${inter.variable} bg-background`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <CartProvider>
          {children}
          <Toaster position="top-center" />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
