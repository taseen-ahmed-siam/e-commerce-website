"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative h-[70vh] md:h-[80vh] bg-card overflow-hidden"
    >
      <Image
        src="/images/hero.jpg"
        alt="Atelier Nori"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
      <div className="absolute inset-0 flex items-end justify-center pb-12 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center px-4 text-balance"
        >
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-foreground mb-4 md:mb-6">
            Quietly crafted.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-foreground/80 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
            Home objects designed for quiet permanence.
          </p>
          <Button asChild size="lg" className="text-base px-8">
            <Link href="/#best-sellers">Explore the Studio</Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  )
}
