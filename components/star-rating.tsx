import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  rating: number
  size?: "sm" | "md"
  className?: string
}

export function StarRating({ rating, size = "sm", className }: Props) {
  const sizeClass = size === "md" ? "w-5 h-5" : "w-4 h-4"
  return (
    <div className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            sizeClass,
            n <= rating ? "fill-accent text-accent" : "fill-muted text-muted-foreground/40",
          )}
        />
      ))}
    </div>
  )
}
