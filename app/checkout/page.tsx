import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckoutClient } from "@/components/checkout-client"

export const metadata = {
  title: "Checkout — Atelier Nori",
  description: "Complete your order with Atelier Nori.",
}

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 sm:px-6 py-8 lg:py-12 min-h-[60vh]">
        <Suspense
          fallback={
            <div className="py-20 text-center text-muted-foreground">Preparing checkout…</div>
          }
        >
          <CheckoutClient />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
