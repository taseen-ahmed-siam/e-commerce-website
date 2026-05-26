import { products } from "@/lib/products"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ products })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.slug || !body.price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if product already exists
    const existingProduct = products.find((p) => p.slug === body.slug)
    if (existingProduct) {
      return NextResponse.json(
        { error: "Product with this slug already exists" },
        { status: 400 }
      )
    }

    // Create new product
    const newProduct = {
      slug: body.slug,
      name: body.name,
      category: body.category || "Uncategorized",
      collection: body.collection || "best-sellers",
      price: parseFloat(body.price),
      compareAtPrice: body.compareAtPrice ? parseFloat(body.compareAtPrice) : undefined,
      description: body.description || "",
      details: body.details || [],
      images: body.images || [],
      variants: body.variants || [],
      reviews: body.reviews || [],
      faqs: body.faqs || [],
    }

    products.push(newProduct)
    return NextResponse.json({ product: newProduct }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}
