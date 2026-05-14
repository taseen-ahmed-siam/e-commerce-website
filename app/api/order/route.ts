import { NextResponse } from "next/server"

type OrderItem = {
  name: string
  slug: string
  quantity: number
  price: number
  variants: Record<string, string>
}

type OrderPayload = {
  customer: {
    name: string
    phone: string
    email?: string
    address: string
    city: string
    notes?: string
  }
  items: OrderItem[]
  subtotal: number
  payment: string
}

export async function POST(req: Request) {
  let body: OrderPayload
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 })
  }

  const { customer, items, subtotal, payment } = body
  if (!customer?.name || !customer?.phone || !customer?.address || !customer?.city) {
    return NextResponse.json({ ok: false, error: "Missing required customer fields" }, { status: 400 })
  }
  if (!items?.length) {
    return NextResponse.json({ ok: false, error: "No items in order" }, { status: 400 })
  }

  const orderId = `AN-${Date.now().toString(36).toUpperCase()}`
  const orderedAt = new Date().toISOString()

  const itemsText = items
    .map((it) => {
      const variants = Object.entries(it.variants)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ")
      return `• ${it.name} × ${it.quantity}  —  $${it.price * it.quantity}${variants ? `  (${variants})` : ""}`
    })
    .join("\n")

  const summary = [
    `New order ${orderId}`,
    `Placed: ${orderedAt}`,
    "",
    "Customer",
    `Name:    ${customer.name}`,
    `Phone:   ${customer.phone}`,
    customer.email ? `Email:   ${customer.email}` : null,
    `Address: ${customer.address}`,
    `City:    ${customer.city}`,
    customer.notes ? `Notes:   ${customer.notes}` : null,
    "",
    "Items",
    itemsText,
    "",
    `Subtotal: $${subtotal}`,
    `Payment:  ${payment}`,
  ]
    .filter(Boolean)
    .join("\n")

  const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT
  let forwarded = false

  if (formspreeEndpoint) {
    try {
      const res = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _subject: `New order ${orderId} — Atelier Nori`,
          orderId,
          orderedAt,
          customerName: customer.name,
          phone: customer.phone,
          email: customer.email ?? "",
          address: customer.address,
          city: customer.city,
          notes: customer.notes ?? "",
          payment,
          subtotal,
          items,
          summary,
        }),
      })
      forwarded = res.ok
      if (!res.ok) {
        console.log("[v0] Formspree responded with non-OK status", res.status)
      }
    } catch (err) {
      console.log("[v0] Failed to forward to Formspree", err)
    }
  } else {
    console.log("[v0] FORMSPREE_ENDPOINT not configured. Order summary:\n" + summary)
  }

  return NextResponse.json({ ok: true, orderId, forwarded })
}
