import { products } from "@/lib/products"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  return NextResponse.json({ product })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const productIndex = products.findIndex((p) => p.slug === slug)

    if (productIndex === -1) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Update product
    const updatedProduct = {
      ...products[productIndex],
      name: body.name || products[productIndex].name,
      category: body.category || products[productIndex].category,
      collection: body.collection || products[productIndex].collection,
      price: body.price ? parseFloat(body.price) : products[productIndex].price,
      compareAtPrice: body.compareAtPrice
        ? parseFloat(body.compareAtPrice)
        : products[productIndex].compareAtPrice,
      description: body.description || products[productIndex].description,
      details: body.details || products[productIndex].details,
      images: body.images || products[productIndex].images,
      variants: body.variants || products[productIndex].variants,
    }

    products[productIndex] = updatedProduct
    return NextResponse.json({ product: updatedProduct })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const productIndex = products.findIndex((p) => p.slug === slug)

  if (productIndex === -1) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  const deletedProduct = products.splice(productIndex, 1)
  return NextResponse.json({ product: deletedProduct[0] })
}
