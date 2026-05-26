"use client"

import { useEffect, useState } from "react"
import { ProductForm } from "@/components/admin/product-form"

export default function EditProductPage({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>
}) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [params, setParams] = useState<{ slug: string } | null>(null)

  useEffect(() => {
    ;(async () => {
      const resolvedParams = await paramsPromise
      setParams(resolvedParams)
    })()
  }, [paramsPromise])

  useEffect(() => {
    if (!params) return

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/admin/products/${params.slug}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data.product)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    )
  }

  return <ProductForm product={product} mode="edit" />
}
