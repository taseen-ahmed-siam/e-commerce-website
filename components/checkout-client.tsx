"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldSet, FieldLegend } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { useCart, type CartItem } from "@/components/cart-context"
import { getProduct } from "@/lib/products"

export function CheckoutClient() {
  const router = useRouter()
  const params = useSearchParams()
  const cart = useCart()

  // If "Buy Now" provided params, build a single-item cart for this checkout.
  const buyNowItem: CartItem | null = useMemo(() => {
    const slug = params.get("slug")
    const qty = Number(params.get("qty") ?? "1")
    if (!slug) return null
    const product = getProduct(slug)
    if (!product) return null
    const variants: Record<string, string> = {}
    product.variants.forEach((v) => {
      const fromUrl = params.get(v.name)
      variants[v.name] = fromUrl && v.options.includes(fromUrl) ? fromUrl : v.options[0]
    })
    return {
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: Math.max(1, qty),
      variants,
    }
  }, [params])

  const items = buyNowItem ? [buyNowItem] : cart.items
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0)

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
  })
  const [payment, setPayment] = useState("cod")
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState<{ orderId: string } | null>(null)

  useEffect(() => {
    if (!buyNowItem && cart.items.length === 0 && !confirmation) {
      // No items at all — friendly empty state will show below.
    }
  }, [buyNowItem, cart.items.length, confirmation])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items,
          subtotal,
          payment: payment === "cod" ? "Cash on Delivery (COD)" : "Card on Delivery",
        }),
      })
      const data = await res.json()
      if (data.ok) {
        if (!buyNowItem) cart.clear()
        setConfirmation({ orderId: data.orderId })
      } else {
        alert(data.error ?? "Something went wrong placing your order. Please try again.")
      }
    } catch (err) {
      console.log("[v0] Order submission failed", err)
      alert("Something went wrong placing your order. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0 && !confirmation) {
    return (
      <div className="text-center py-20">
        <h1 className="font-serif text-3xl mb-3">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Add a piece to your bag to begin checkout.</p>
        <Button asChild>
          <Link href="/">Continue browsing</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
          <header>
            <div className="text-xs uppercase tracking-[0.2em] text-accent mb-2">Checkout</div>
            <h1 className="font-serif text-3xl md:text-4xl">Delivery details</h1>
            <p className="text-muted-foreground mt-2">
              We&apos;ll confirm your order over the phone before dispatching.
            </p>
          </header>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Doe"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input
                  id="phone"
                  required
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 555 000 0000"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email (optional)</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="address">Full Address</FieldLabel>
              <Textarea
                id="address"
                required
                rows={3}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Street, building, apartment"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="city">City</FieldLabel>
              <Input
                id="city"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Lisbon"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="notes">Order notes (optional)</FieldLabel>
              <Textarea
                id="notes"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Delivery instructions, gift note…"
              />
            </Field>
          </FieldGroup>

          <FieldSet className="border border-border rounded-sm p-5">
            <FieldLegend>Payment Method</FieldLegend>
            <FieldDescription>Select how you&apos;d like to pay</FieldDescription>
            <RadioGroup value={payment} onValueChange={setPayment} className="mt-3 space-y-2">
              <label className="flex items-start gap-3 p-3 border border-border rounded-sm cursor-pointer has-[input:checked]:border-accent has-[input:checked]:bg-accent/5 transition-colors">
                <RadioGroupItem value="cod" id="cod" className="mt-0.5" />
                <div>
                  <Label htmlFor="cod" className="font-medium cursor-pointer">
                    Cash on Delivery (COD)
                  </Label>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    Pay when your parcel arrives. No prepayment required.
                  </div>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 border border-border rounded-sm cursor-pointer has-[input:checked]:border-accent has-[input:checked]:bg-accent/5 transition-colors">
                <RadioGroupItem value="card" id="card" className="mt-0.5" />
                <div>
                  <Label htmlFor="card" className="font-medium cursor-pointer">
                    Card on Delivery
                  </Label>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    Pay by card to the courier on arrival.
                  </div>
                </div>
              </label>
            </RadioGroup>
          </FieldSet>

          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="w-full h-12 text-base bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Spinner /> Placing order…
              </span>
            ) : (
              `Confirm Order — $${subtotal}`
            )}
          </Button>
        </form>

        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-24 bg-card border border-border rounded-sm p-6">
            <h2 className="font-serif text-2xl mb-4">Order summary</h2>
            <ul className="divide-y divide-border">
              {items.map((item, i) => (
                <li key={`${item.slug}-${i}`} className="flex gap-4 py-4">
                  <div className="relative w-20 h-20 flex-shrink-0 bg-background rounded overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                    <span className="absolute -top-1 -right-1 bg-foreground text-background text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium leading-tight">{item.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {Object.entries(item.variants).map(([k, v]) => (
                        <span key={k} className="mr-2">
                          {k}: {v}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="font-medium tabular-nums">${item.price * item.quantity}</div>
                </li>
              ))}
            </ul>
            <div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground">Calculated at confirmation</span>
              </div>
              <div className="flex justify-between text-base pt-2 border-t border-border mt-2">
                <span className="font-medium">Total</span>
                <span className="font-serif text-xl">${subtotal}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {confirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-background rounded-md max-w-md w-full p-8 sm:p-10 text-center shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6"
              >
                <CheckCircle2 className="w-9 h-9 text-accent" strokeWidth={1.5} />
              </motion.div>
              <h2 className="font-serif text-3xl sm:text-4xl mb-3 text-balance">
                Thank you for your order!
              </h2>
              <p className="text-muted-foreground mb-2">
                Your order <span className="font-medium text-foreground">{confirmation.orderId}</span>{" "}
                has been placed.
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                A studio member will be in touch by phone within 24 hours to confirm your delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/">Continue shopping</Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
