export type Variant = {
  name: string
  options: string[]
}

export type Review = {
  id: string
  author: string
  location: string
  rating: number
  date: string
  title: string
  body: string
}

export type Product = {
  slug: string
  name: string
  category: string
  collection: "best-sellers" | "new-arrivals"
  price: number
  compareAtPrice?: number
  description: string
  details: string[]
  images: string[]
  variants: Variant[]
  reviews: Review[]
  faqs: { q: string; a: string }[]
}

const sharedFaqs = [
  {
    q: "What is the lead time for shipping?",
    a: "Orders are dispatched from our studio within 2 business days. Standard delivery typically arrives within 3 to 5 days.",
  },
  {
    q: "Do you offer international shipping?",
    a: "Yes — we ship worldwide. International duties and taxes are calculated at checkout where applicable.",
  },
  {
    q: "What is your return policy?",
    a: "We accept returns within 30 days of delivery for unused items in original packaging. Made-to-order pieces are final sale.",
  },
  {
    q: "How do I care for this piece?",
    a: "Wipe gently with a soft damp cloth. Avoid abrasive cleaners and prolonged direct sunlight to preserve the natural finish.",
  },
]

const sharedReviews: Review[] = [
  {
    id: "r1",
    author: "Hannah L.",
    location: "Copenhagen, DK",
    rating: 5,
    date: "March 12, 2026",
    title: "Quietly extraordinary",
    body: "The craftsmanship is immediately obvious. It has the weight, texture, and presence of an heirloom. Already a favorite corner of our home.",
  },
  {
    id: "r2",
    author: "Marcus T.",
    location: "Brooklyn, NY",
    rating: 5,
    date: "February 28, 2026",
    title: "Better in person",
    body: "I was impressed by the photos but the piece is even more beautiful in real life. The finish has a subtle, hand-made quality you cannot fake.",
  },
  {
    id: "r3",
    author: "Sofia P.",
    location: "Lisbon, PT",
    rating: 4,
    date: "February 9, 2026",
    title: "Worth every penny",
    body: "Premium packaging, fast shipping, and a piece that genuinely elevates the space. Will absolutely shop again.",
  },
]

export const products: Product[] = [
  {
    slug: "noma-vase",
    name: "Pro Gaming Headphones",
    category: "Audio",
    collection: "best-sellers",
    price: 168,
    compareAtPrice: 210,
    description:
      "Premium wireless gaming headphones with active noise cancellation and immersive surround sound. Hand-tuned audio with noise-isolating design for competitive gaming and professional use.",
    details: [
      "Wireless with 40-hour battery life",
      "Active noise cancellation technology",
      "Premium comfort padding for extended wear",
      "Compatible with PC, Mac, Mobile, Gaming Consoles",
    ],
    images: [
      "/images/products/vase-1.png",
      "/images/products/vase-2.png",
      "/images/products/vase-3.png",
      "/images/products/vase-4.png",
    ],
    variants: [
      { name: "Color", options: ["Space Black", "Arctic White", "Cyberpunk Red"] },
      { name: "Connection", options: ["Wireless", "3.5mm Jack"] },
    ],
    reviews: sharedReviews,
    faqs: sharedFaqs,
  },
  {
    slug: "kasa-bowl",
    name: "Smart Wireless Watch",
    category: "Wearables",
    collection: "best-sellers",
    price: 84,
    description:
      "Advanced smartwatch with health tracking, notifications, and all-day battery. Durable sapphire glass and water-resistant design for everyday use.",
    details: [
      "AMOLED display with always-on mode",
      "7-day battery life",
      "5ATM water resistance",
      "Health tracking: HR, SpO2, Sleep, Steps",
    ],
    images: ["/images/products/bowl.png", "/images/products/vase-2.png", "/images/products/vase-4.png"],
    variants: [
      { name: "Size", options: ["42mm", "46mm"] },
      { name: "Color", options: ["Midnight Black", "Silver", "Gold"] },
    ],
    reviews: sharedReviews,
    faqs: sharedFaqs,
  },
  {
    slug: "lume-table-lamp",
    name: "Precision Gaming Mouse",
    category: "Peripherals",
    collection: "new-arrivals",
    price: 320,
    compareAtPrice: 380,
    description:
      "Ultra-responsive gaming mouse with 8K polling rate and pixart sensor. Ergonomic design for competitive esports and high-precision gaming.",
    details: [
      "8K polling rate, sub-1ms latency",
      "26,000 DPI sensor",
      "Lightweight honeycomb shell design",
      "8 programmable buttons with macro support",
    ],
    images: ["/images/products/lamp.png", "/images/products/lifestyle-1.png", "/images/products/vase-3.png"],
    variants: [
      { name: "Grip Style", options: ["Palm", "Claw", "Fingertip"] },
      { name: "DPI Profile", options: ["Standard", "Esports", "Precision"] },
    ],
    reviews: sharedReviews,
    faqs: sharedFaqs,
  },
  {
    slug: "fenn-throw",
    name: "100W Power Bank",
    category: "Charging",
    collection: "best-sellers",
    price: 145,
    description:
      "Ultra-fast 100W portable power bank with dual USB-C ports. Charge laptops, phones, and tablets simultaneously with intelligent power distribution.",
    details: ["100W total output", "Dual USB-C ports for simultaneous charging", "25,000mAh capacity", "Quick-charge technology"],
    images: ["/images/products/throw.png", "/images/products/pillow.png", "/images/products/lifestyle-1.png"],
    variants: [
      { name: "Capacity", options: ["25000mAh", "30000mAh"] },
      { name: "Color", options: ["Space Black", "Titanium Gray"] },
    ],
    reviews: sharedReviews,
    faqs: sharedFaqs,
  },
  {
    slug: "ora-candle",
    name: "True Wireless Earbuds",
    category: "Audio",
    collection: "new-arrivals",
    price: 48,
    description:
      "Premium true wireless earbuds with active noise cancellation and superior sound quality. 8-hour battery in compact charging case.",
    details: ["Active noise cancellation", "8-hour battery + 32 hours with case", "IPX4 water resistance", "360-degree spatial audio"],
    images: ["/images/products/candle.png", "/images/products/vase-4.png"],
    variants: [{ name: "Color", options: ["Pearl White", "Midnight Black", "Deep Ocean Blue"] }],
    reviews: sharedReviews,
    faqs: sharedFaqs,
  },
  {
    slug: "halo-mirror",
    name: "2TB Portable SSD",
    category: "Storage",
    collection: "new-arrivals",
    price: 540,
    compareAtPrice: 620,
    description:
      "Ultra-fast portable SSD with 2TB capacity and Thunderbolt 3 connectivity. Perfect for content creators and professionals requiring fast data transfer.",
    details: ["2TB ultra-fast storage", "Thunderbolt 3 connectivity", "1050MB/s read speeds", "Rugged aluminum design, shock-resistant"],
    images: ["/images/products/mirror.png", "/images/products/lifestyle-1.png"],
    variants: [{ name: "Capacity", options: ["1TB", "2TB", "4TB"] }],
    reviews: sharedReviews,
    faqs: sharedFaqs,
  },
  {
    slug: "muna-pillow",
    name: "4K Streaming Webcam",
    category: "Content Creation",
    collection: "best-sellers",
    price: 96,
    description:
      "Professional 4K webcam with advanced auto-focus and noise-canceling microphone. Ideal for streaming, conferencing, and content creation.",
    details: ["4K resolution at 30fps", "Auto-focus with face detection", "Built-in noise-canceling mic", "Wide 90° field of view"],
    images: ["/images/products/pillow.png", "/images/products/throw.png"],
    variants: [
      { name: "Resolution", options: ["1080p", "2K", "4K"] },
      { name: "Mount", options: ["Desktop Clip", "Tripod Mount"] },
    ],
    reviews: sharedReviews,
    faqs: sharedFaqs,
  },
  {
    slug: "oka-tray",
    name: "Premium USB-C Hub",
    category: "Connectivity",
    collection: "new-arrivals",
    price: 128,
    description:
      "7-in-1 USB-C hub with Thunderbolt 3 support. Expand your laptop with multiple high-speed ports for seamless connectivity.",
    details: ["7 ports: 2x USB 3.0, HDMI, SD, USB-C", "Thunderbolt 3 support", "Aluminum chassis", "Maximum 40Gbps bandwidth"],
    images: ["/images/products/tray.png", "/images/products/bowl.png"],
    variants: [{ name: "Port Configuration", options: ["Standard 7-in-1", "Pro 11-in-1"] }],
    reviews: sharedReviews,
    faqs: sharedFaqs,
  },
]

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug)
}

export function getRelatedProducts(slug: string) {
  const product = getProduct(slug)
  if (!product) return products.slice(0, 4)
  return products.filter((p) => p.slug !== slug && p.category === product.category).concat(
    products.filter((p) => p.slug !== slug && p.category !== product.category),
  ).slice(0, 6)
}
