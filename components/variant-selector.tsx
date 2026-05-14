"use client"

import { cn } from "@/lib/utils"
import type { Variant } from "@/lib/products"

type Props = {
  variants: Variant[]
  selected: Record<string, string>
  onChange: (next: Record<string, string>) => void
}

export function VariantSelector({ variants, selected, onChange }: Props) {
  if (variants.length === 0) return null

  return (
    <div className="space-y-5">
      {variants.map((variant) => (
        <div key={variant.name}>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm font-medium uppercase tracking-wide">{variant.name}</span>
            <span className="text-sm text-muted-foreground">{selected[variant.name]}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {variant.options.map((option) => {
              const isActive = selected[variant.name] === option
              return (
                <button
                  key={option}
                  onClick={() => onChange({ ...selected, [variant.name]: option })}
                  className={cn(
                    "px-4 py-2 text-sm rounded-sm border transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:border-foreground",
                  )}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
