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

export async function POST(req: Request) {
  const resendApiKey = process.env.RESEND_API_KEY
  const resend = resendApiKey ? new Resend(resendApiKey) : null

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

  const emailFrom = process.env.RESEND_FROM_EMAIL || "noreply@techzo.com"
  const adminRecipient = process.env.ORDER_NOTIFICATION_EMAIL

  // Send customer confirmation email via Resend
  let customerEmailSent = false
  if (customer.email && resend) {
    try {
      const itemsTableHtml = items
        .map(
          (it) =>
            `<tr style="border-bottom: 1px solid #333;">
              <td style="padding: 8px; color: #f0f0f0;">${it.name}</td>
              <td style="padding: 8px; text-align: center; color: #00d9ff;">${it.quantity}</td>
              <td style="padding: 8px; text-align: right; color: #b537f2;">$${(it.price * it.quantity).toFixed(2)}</td>
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
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #f0f0f0; background-color: #0a0d14;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <!-- Header with neon accent -->
      <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-top: 3px solid #b537f2; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="color: #b537f2; margin: 0 0 10px 0; font-size: 24px;">Order Confirmed!</h1>
        <p style="color: #00d9ff; margin: 0; font-size: 14px;">Thank you for your order, <strong>${customer.name}</strong></p>
      </div>
      
      <p style="color: #a0a0a0; font-size: 14px; margin-bottom: 20px;">We'll confirm your delivery details by phone within 24 hours.</p>
      
      <div style="background-color: #16213e; padding: 15px; border: 1px solid #b537f2; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 8px 0;"><strong style="color: #b537f2;">Order ID:</strong> <span style="color: #00d9ff;">${orderId}</span></p>
        <p style="margin: 8px 0;"><strong style="color: #b537f2;">Placed:</strong> <span style="color: #00d9ff;">${new Date(orderedAt).toLocaleString()}</span></p>
      </div>

      <h2 style="font-size: 18px; margin-bottom: 12px; color: #00d9ff; border-bottom: 2px solid #b537f2; padding-bottom: 8px;">Items</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #1a1a2e; border-bottom: 2px solid #b537f2;">
            <th style="padding: 10px; text-align: left; color: #b537f2;">Product</th>
            <th style="padding: 10px; text-align: center; color: #b537f2;">Qty</th>
            <th style="padding: 10px; text-align: right; color: #b537f2;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsTableHtml}
        </tbody>
      </table>

      <div style="background-color: #16213e; padding: 15px; border: 1px solid #00d9ff; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; font-size: 16px; color: #00d9ff;">Delivery Details</h3>
        <p style="margin: 5px 0; color: #f0f0f0;">
          <strong style="color: #b537f2;">${customer.name}</strong><br>
          ${customer.address}<br>
          ${customer.city}${customer.email ? `<br><span style="color: #00d9ff;">${customer.email}</span>` : ""}<br>
          <strong style="color: #b537f2;">Phone:</strong> ${customer.phone}
        </p>
        ${customer.notes ? `<p style="margin: 10px 0 0 0; font-style: italic; color: #a0a0a0;">Notes: ${customer.notes}</p>` : ""}
      </div>

      <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 15px; border-left: 4px solid #00d9ff; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; text-align: right; color: #a0a0a0;"><strong style="color: #b537f2;">Payment Method:</strong> ${payment}</p>
        <p style="margin: 10px 0 0 0; text-align: right; font-size: 18px; color: #b537f2;"><strong>Total:</strong> <span style="color: #00d9ff;">$${subtotal.toFixed(2)}</span></p>
      </div>

      <p style="font-size: 14px; color: #a0a0a0; border-top: 1px solid #b537f2; padding-top: 15px; margin-bottom: 10px;">
        A studio member will reach out by phone to confirm details and arrange delivery. If you need to reach us, please reply to this email or contact our support team.
      </p>
      
      <p style="font-size: 12px; color: #666; margin-top: 20px; border-top: 1px solid #333; padding-top: 10px;">
        © 2024 Techzo. All rights reserved.
      </p>
    </div>
  </body>
</html>
      `

      const emailRes = await resend.emails.send({
        from: emailFrom,
        to: customer.email,
        subject: `Order Confirmation: ${orderId}`,
        html: htmlContent,
        text: summary,
      })

      customerEmailSent = !!emailRes.data?.id
      if (!customerEmailSent) {
        console.log("[v0] Resend email failed:", emailRes.error)
      }
    } catch (err) {
      console.log("[v0] Failed to send customer confirmation email", err)
    }
  }

  // Send order notification to admin inbox
  let adminEmailSent = false
  if (adminRecipient && resend) {
    try {
      const adminHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order Notification</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #f0f0f0; background-color: #0a0d14;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <!-- Header with neon accent -->
      <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-top: 3px solid #00d9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="color: #00d9ff; margin: 0 0 10px 0; font-size: 24px;">New Order Received!</h1>
        <p style="color: #b537f2; margin: 0; font-size: 14px;">Order ID: <strong>${orderId}</strong></p>
      </div>

      <div style="background-color: #16213e; padding: 15px; border: 1px solid #00d9ff; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 8px 0;"><strong style="color: #b537f2;">Order ID:</strong> <span style="color: #00d9ff;">${orderId}</span></p>
        <p style="margin: 8px 0;"><strong style="color: #b537f2;">Placed:</strong> <span style="color: #00d9ff;">${new Date(orderedAt).toLocaleString()}</span></p>
        <p style="margin: 8px 0;"><strong style="color: #b537f2;">Payment:</strong> <span style="color: #00d9ff;">${payment}</span></p>
        <p style="margin: 8px 0;"><strong style="color: #b537f2;">Total:</strong> <span style="color: #b537f2;">$${subtotal.toFixed(2)}</span></p>
      </div>

      <h2 style="font-size: 18px; margin-bottom: 12px; color: #b537f2; border-bottom: 2px solid #b537f2; padding-bottom: 8px;">Customer Details</h2>
      <div style="background-color: #16213e; padding: 15px; border: 1px solid #b537f2; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 5px 0; color: #f0f0f0;"><strong style="color: #b537f2;">Name:</strong> <span style="color: #00d9ff;">${customer.name}</span></p>
        <p style="margin: 5px 0; color: #f0f0f0;"><strong style="color: #b537f2;">Phone:</strong> <span style="color: #00d9ff;">${customer.phone}</span></p>
        <p style="margin: 5px 0; color: #f0f0f0;"><strong style="color: #b537f2;">Email:</strong> <span style="color: #00d9ff;">${customer.email || "Not provided"}</span></p>
        <p style="margin: 5px 0; color: #f0f0f0;"><strong style="color: #b537f2;">Address:</strong> <span style="color: #a0a0a0;">${customer.address}</span></p>
        <p style="margin: 5px 0; color: #f0f0f0;"><strong style="color: #b537f2;">City:</strong> <span style="color: #a0a0a0;">${customer.city}</span></p>
        ${customer.notes ? `<p style="margin: 10px 0 0 0; font-style: italic; color: #a0a0a0;"><strong style="color: #b537f2;">Notes:</strong> ${customer.notes}</p>` : ""}
      </div>

      <h2 style="font-size: 18px; margin-bottom: 12px; color: #00d9ff; border-bottom: 2px solid #b537f2; padding-bottom: 8px;">Items Ordered</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #1a1a2e; border-bottom: 2px solid #b537f2;">
            <th style="padding: 10px; text-align: left; color: #b537f2;">Product</th>
            <th style="padding: 10px; text-align: center; color: #b537f2;">Qty</th>
            <th style="padding: 10px; text-align: right; color: #b537f2;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsTableHtml}
        </tbody>
      </table>

      <p style="font-size: 12px; color: #666; margin-top: 20px; border-top: 1px solid #333; padding-top: 10px;">
        This email was generated automatically when the order was submitted.
      </p>
    </div>
  </body>
</html>
      `

      const adminRes = await resend.emails.send({
        from: emailFrom,
        to: adminRecipient,
        subject: `New Order ${orderId} — Techzo`,
        html: adminHtml,
        text: summary,
      })

      adminEmailSent = !!adminRes.data?.id
      if (!adminEmailSent) {
        console.log("[v0] Admin notification email failed:", adminRes.error)
      }
    } catch (err) {
      console.log("[v0] Failed to send admin notification email", err)
    }
  } else if (!adminRecipient) {
    console.log("[v0] ORDER_NOTIFICATION_EMAIL not configured. Admin notification skipped.")
  }

  return NextResponse.json({ ok: true, orderId, forwarded, customerEmailSent, adminEmailSent })
}
