"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProductFormProps {
  product?: any
  mode: "create" | "edit"
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    slug: product?.slug || "",
    name: product?.name || "",
    category: product?.category || "Ceramics",
    collection: product?.collection || "best-sellers",
    price: product?.price || "",
    compareAtPrice: product?.compareAtPrice || "",
    description: product?.description || "",
    details: product?.details?.join("\n") || "",
    images: product?.images?.join("\n") || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!formData.slug || !formData.name || !formData.price) {
        setError("Please fill in all required fields")
        setLoading(false)
        return
      }

      const payload = {
        slug: formData.slug,
        name: formData.name,
        category: formData.category,
        collection: formData.collection,
        price: formData.price,
        compareAtPrice: formData.compareAtPrice || undefined,
        description: formData.description,
        details: formData.details
          .split("\n")
          .map((d) => d.trim())
          .filter(Boolean),
        images: formData.images
          .split("\n")
          .map((i) => i.trim())
          .filter(Boolean),
      }

      const url =
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${product.slug}`
      const method = mode === "create" ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Failed to save product")
        return
      }

      router.push("/admin")
      router.refresh()
    } catch (err) {
      setError("An error occurred while saving the product")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-3xl">
        <h1 className="text-4xl font-serif mb-8">
          {mode === "create" ? "Create Product" : "Edit Product"}
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="slug">Slug (URL)*</Label>
                  <Input
                    id="slug"
                    name="slug"
                    placeholder="e.g., noma-vase"
                    value={formData.slug}
                    onChange={handleChange}
                    disabled={mode === "edit"}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name">Product Name*</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Noma Sculptural Vase"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    placeholder="e.g., Ceramics"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="collection">Collection</Label>
                  <Select
                    value={formData.collection}
                    onValueChange={(value) =>
                      handleSelectChange("collection", value)
                    }
                  >
                    <SelectTrigger id="collection">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="best-sellers">Best Sellers</SelectItem>
                      <SelectItem value="new-arrivals">New Arrivals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ($)*</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="168"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="compareAtPrice">Compare At Price ($)</Label>
                  <Input
                    id="compareAtPrice"
                    name="compareAtPrice"
                    type="number"
                    step="0.01"
                    placeholder="210"
                    value={formData.compareAtPrice}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Product description..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="details">Details (one per line)</Label>
                <Textarea
                  id="details"
                  name="details"
                  placeholder="Hand-thrown stoneware&#10;Matte mineral glaze&#10;Holds water"
                  value={formData.details}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="images">Image URLs (one per line)</Label>
                <Textarea
                  id="images"
                  name="images"
                  placeholder="/images/products/vase-1.jpg&#10;/images/products/vase-2.jpg"
                  value={formData.images}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={loading} size="lg">
                  {loading ? "Saving..." : mode === "create" ? "Create Product" : "Update Product"}
                </Button>
                <Button type="button" variant="outline" asChild size="lg">
                  <Link href="/admin">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
