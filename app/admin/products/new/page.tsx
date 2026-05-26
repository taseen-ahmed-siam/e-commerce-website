import { ProductForm } from "@/components/admin/product-form"

export const metadata = {
  title: "Create Product — Admin — Techzo",
  description: "Create a new product",
}

export default function CreateProductPage() {
  return <ProductForm mode="create" />
}
