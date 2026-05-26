"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Suspense } from "react"
import { Product } from "@/lib/products"
import { ProductGrid } from "@/components/product-grid"

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([])
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setResults(data.results)
      } catch (error) {
        console.error("Search error:", error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-serif mb-2">Search Results</h1>
        <p className="text-muted-foreground">
          {query && `Results for "${query}"`}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Searching...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No products found {query && `for "${query}"`}
          </p>
          <Link href="/" className="text-primary hover:underline">
            Return to home
          </Link>
        </div>
      ) : (
        <>
          <p className="text-muted-foreground mb-8">
            Found {results.length} product{results.length !== 1 ? "s" : ""}
          </p>
          <ProductGrid products={results} />
        </>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <main className="min-h-screen">
      <Suspense
        fallback={
          <div className="container mx-auto px-4 sm:px-6 py-12">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading search...</p>
            </div>
          </div>
        }
      >
        <SearchResults />
      </Suspense>
    </main>
  )
}
