import { products } from "@/lib/products"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")?.toLowerCase().trim() || ""

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  const results = products.filter((product) => {
    const searchableText = `${product.name} ${product.category} ${product.description}`.toLowerCase()
    return searchableText.includes(query)
  })

  return NextResponse.json({ results })
}
