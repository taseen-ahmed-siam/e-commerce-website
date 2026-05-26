import { NextResponse } from "next/server"
import { Resend } from "resend"

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

const resend = new Resend(process.env.RESEND_API_KEY)

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

  // Send admin notification via Formspree
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
          _subject: `New order ${orderId} — Techzo`,
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

  // Send customer confirmation email via Resend
  let customerEmailSent = false
  if (customer.email && process.env.RESEND_API_KEY) {
    try {
      const itemsTableHtml = items
        .map(
          (it) =>
            `<tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${it.name}</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${it.quantity}</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(it.price * it.quantity).toFixed(2)}</td>
            </tr>`
        )
        .join("")

      const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #1a1a1a; margin-bottom: 10px;">Order Confirmed! 🎉</h1>
      <p style="color: #666; font-size: 14px; margin-bottom: 20px;">Thank you for your order, <strong>${customer.name}</strong>. We'll confirm your delivery details by phone within 24 hours.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 5px 0;"><strong>Order ID:</strong> <span style="color: #666;">${orderId}</span></p>
        <p style="margin: 5px 0;"><strong>Placed:</strong> <span style="color: #666;">${new Date(orderedAt).toLocaleString()}</span></p>
      </div>

      <h2 style="font-size: 18px; margin-bottom: 12px; color: #1a1a1a;">Items</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
            <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
            <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsTableHtml}
        </tbody>
      </table>

      <div style="background-color: #f9f9f9; padding: 15px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; font-size: 16px;">Delivery Details</h3>
        <p style="margin: 5px 0;">
          <strong>${customer.name}</strong><br>
          ${customer.address}<br>
          ${customer.city}${customer.email ? `<br>${customer.email}` : ""}<br>
          <strong>Phone:</strong> ${customer.phone}
        </p>
        ${customer.notes ? `<p style="margin: 10px 0 0 0; font-style: italic; color: #666;">Notes: ${customer.notes}</p>` : ""}
      </div>

      <div style="background-color: #f0f0f0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; text-align: right;"><strong>Payment Method:</strong> ${payment}</p>
        <p style="margin: 10px 0 0 0; text-align: right; font-size: 18px;"><strong>Total:</strong> $${subtotal.toFixed(2)}</p>
      </div>

      <p style="font-size: 14px; color: #666; border-top: 1px solid #eee; padding-top: 15px; margin-bottom: 10px;">
        A studio member will reach out by phone to confirm details and arrange delivery. If you need to reach us, please reply to this email or contact our support team.
      </p>
      
      <p style="font-size: 12px; color: #999; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
        © 2024 Techzo. All rights reserved.
      </p>
    </div>
  </body>
</html>
      `

      const emailRes = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "noreply@techzo.com",
        to: customer.email,
        subject: `Order Confirmation: ${orderId}`,
        html: htmlContent,
      })

      customerEmailSent = !!emailRes.data?.id
      if (!customerEmailSent) {
        console.log("[v0] Resend email failed:", emailRes.error)
      }
    } catch (err) {
      console.log("[v0] Failed to send customer confirmation email", err)
    }
  }

  return NextResponse.json({ ok: true, orderId, forwarded, customerEmailSent })
}
