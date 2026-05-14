"use client"

import Link from "next/link"
import { Search, ShoppingBag } from "lucide-react"
import { useCart } from "@/components/cart-context"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"

export function Header() {
  const { items, count, subtotal, remove } = useCart()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="font-serif text-xl sm:text-2xl tracking-tight">
            Atelier Nori
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link href="/#best-sellers" className="hover:text-accent transition-colors">
              Best Sellers
            </Link>
            <Link href="/#new-arrivals" className="hover:text-accent transition-colors">
              New Arrivals
            </Link>
            <Link href="/#about" className="hover:text-accent transition-colors">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            {searchOpen ? (
              <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }}>
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-32 sm:w-40"
                  autoFocus
                  onBlur={() => setSearchOpen(false)}
                />
              </motion.div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-1.5 hover:text-accent transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <button className="p-1.5 hover:text-accent transition-colors relative" aria-label="Cart">
                  <ShoppingBag className="w-5 h-5" />
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md flex flex-col">
                <SheetHeader>
                  <SheetTitle className="font-serif text-2xl">Cart ({count})</SheetTitle>
                  <SheetDescription>Review your selection</SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto py-6">
                  {items.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">Your cart is empty</div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item, i) => {
                        const variantKey = Object.entries(item.variants)
                          .map(([k, v]) => `${k}:${v}`)
                          .join("|")
                        return (
                          <div key={`${item.slug}-${variantKey}-${i}`} className="flex gap-4">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="bg-card rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm leading-tight">{item.name}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {Object.entries(item.variants).map(([k, v]) => (
                                  <span key={k} className="mr-2">
                                    {k}: {v}
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-sm">Qty: {item.quantity}</span>
                                <button
                                  onClick={() => remove(item.slug, item.variants)}
                                  className="text-xs underline hover:text-destructive"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                            <div className="text-sm font-medium">${item.price * item.quantity}</div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
                {items.length > 0 && (
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center justify-between text-base font-medium">
                      <span>Subtotal</span>
                      <span className="font-serif text-xl">${subtotal}</span>
                    </div>
                    <Button asChild size="lg" className="w-full">
                      <Link href="/checkout">Continue to Checkout</Link>
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
