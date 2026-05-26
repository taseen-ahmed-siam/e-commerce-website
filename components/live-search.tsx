"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Product } from "@/lib/products"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

export function LiveSearch() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`)
        const data = await response.json()
        setResults(data.results.slice(0, 6)) // Limit to 6 results
      } catch (error) {
        console.error("Search error:", error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchResults, 300) // Debounce 300ms
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsOpen(false)
    }
  }

  return (
    <div ref={searchRef} className="relative w-32 sm:w-40">
      <form onSubmit={handleSearch} className="w-full">
        <Input
          type="search"
          placeholder="Search..."
          className="w-full"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => searchQuery && setIsOpen(true)}
        />
      </form>

      {isOpen && searchQuery.trim() && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No products found
            </div>
          ) : (
            <>
              <div className="space-y-2 p-2">
                {results.map((product) => (
                  <Link
                    key={product.slug}
                    href={`/product/${product.slug}`}
                    onClick={() => {
                      setSearchQuery("")
                      setIsOpen(false)
                    }}
                    className="flex gap-3 p-2 rounded hover:bg-accent transition-colors group"
                  >
                    <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-card">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium line-clamp-1">
                        {product.name}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {product.category}
                      </div>
                      <div className="text-sm font-semibold mt-1">
                        ${product.price}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="border-t p-2">
                <form onSubmit={handleSearch} className="w-full">
                  <button
                    type="submit"
                    className="w-full text-center text-xs text-primary hover:text-primary/80 font-medium py-2 transition-colors"
                  >
                    View all results for "{searchQuery}"
                  </button>
                </form>
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  )
}
