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
      className="relative h-[50vh] sm:h-[55vh] md:h-[75vh] lg:h-[80vh] bg-card overflow-hidden"
    >
      <Image
        src="/images/hero.png"
        alt="Techzo Gaming Gadgets"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent dark:from-black/70" />
      <div className="absolute inset-0 flex items-center md:items-end justify-center pb-8 sm:pb-16 md:pb-20 lg:pb-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center px-4 text-balance"
        >
          <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white mb-4 md:mb-6 mt-9">
            Buy anything with <span className="text-blue-500">Free delivery</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
          </p>
          <Button asChild size="lg" className="text-base px-8">
            <Link href="/#best-sellers">Shop Gaming Gear</Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  )
}
