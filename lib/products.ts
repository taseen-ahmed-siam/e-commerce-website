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
    name: "Noma Sculptural Vase",
    category: "Ceramics",
    collection: "best-sellers",
    price: 168,
    compareAtPrice: 210,
    description:
      "A quietly sculptural stoneware vase, hand-thrown by our studio in Porto. Each piece is finished with a soft matte glaze that warms the room and tempers afternoon light.",
    details: [
      "Hand-thrown stoneware, kiln-fired in Porto",
      "Matte mineral glaze in Terracotta",
      "Holds water — suitable for fresh florals",
      "Dimensions: 32 × 14 cm (12.5 × 5.5 in)",
    ],
    images: [
      "/images/products/vase-1.jpg",
      "/images/products/vase-2.jpg",
      "/images/products/vase-3.jpg",
      "/images/products/vase-4.jpg",
    ],
    variants: [
      { name: "Size", options: ["Small", "Medium", "Large"] },
      { name: "Color", options: ["Terracotta", "Bone", "Ink"] },
    ],
    reviews: sharedReviews,
    faqs: sharedFaqs,
  },
  {
    slug: "kasa-bowl",
    name: "Kasa Stoneware Bowl",
    category: "Ceramics",
    collection: "best-sellers",
    price: 84,
    description:
      "A generous everyday bowl with a softly rolled rim. Substantial in the hand and warm against the table.",
    details: [
      "Hand-thrown stoneware",
      "Food, microwave and dishwasher safe",
      "Dimensions: 22 × 8 cm",
    ],
    images: ["/images/products/bowl.jpg", "/images/products/vase-2.jpg", "/images/products/vase-4.jpg"],
    variants: [
      { name: "Size", options: ["Cereal", "Serving"] },
      { name: "Color", options: ["Oat", "Sand"] },
    ],
    reviews: sharedReviews,
    faqs: sharedFaqs,
  },
  {
    slug: "lume-table-lamp",
    name: "Lume Brass Table Lamp",
    category: "Lighting",
    collection: "new-arrivals",
    price: 320,
    compareAtPrice: 380,
    description:
      "A solid brass column finished by hand and topped with a hand-rolled linen shade. Designed to throw a warm, low ambient light.",
    details: [
      "Solid hand-finished brass base",
      "Hand-rolled linen shade",
      "E27 socket, dimmable, EU/UK/US plug",
    ],
    images: ["/images/products/lamp.jpg", "/images/products/lifestyle-1.jpg", "/images/products/vase-3.jpg"],
    variants: [
      { name: "Finish", options: ["Polished", "Antiqued"] },
      { name: "Plug", options: ["EU", "UK", "US"] },
    ],
    reviews: sharedReviews,
    faqs: sharedFaqs,
  },
  {
    slug: "fenn-throw",
    name: "Fenn Heavy Linen Throw",
    category: "Textiles",
    collection: "best-sellers",
    price: 145,
    description:
      "A heavyweight stonewashed linen throw with hand-knotted fringes. Soft from the first wash and only better with time.",
    details: ["100% European flax linen", "Stonewashed for softness", "140 × 200 cm"],
    images: ["/images/products/throw.jpg", "/images/products/pillow.jpg", "/images/products/lifestyle-1.jpg"],
    variants: [
      { name: "Color", options: ["Oat", "Clay", "Ink"] },
      { name: "Size", options: ["Throw", "Bed"] },
    ],
    reviews: sharedReviews,
    faqs: sharedFaqs,
  },
  {
    slug: "ora-candle",
    name: "Ora Soy Candle",
    category: "Apothecary",
    collection: "new-arrivals",
    price: 48,
    description:
      "Pressed soy wax in a hand-blown ribbed glass vessel. Cedar, fig leaf and a whisper of vetiver.",
    details: ["100% soy wax", "Cotton wick, 60 hour burn", "220 g"],
    images: ["/images/products/candle.jpg", "/images/products/vase-4.jpg"],
    variants: [{ name: "Scent", options: ["Cedar & Fig", "Smoke & Oud", "Linen & Lily"] }],
    reviews: sharedReviews,
    faqs: sharedFaqs,
  },
  {
    slug: "halo-mirror",
    name: "Halo Arched Mirror",
    category: "Living",
    collection: "new-arrivals",
    price: 540,
    compareAtPrice: 620,
    description:
      "A solid oak arched mirror with a softly chamfered frame. Considered, generous, and quietly architectural.",
    details: ["Solid white oak frame", "Bevelled mirror glass", "90 × 180 cm"],
    images: ["/images/products/mirror.jpg", "/images/products/lifestyle-1.jpg"],
    variants: [{ name: "Finish", options: ["Natural Oak", "Smoked Oak"] }],
    reviews: sharedReviews,
    faqs: sharedFaqs,
  },
  {
    slug: "muna-pillow",
    name: "Muna Linen Pillow",
    category: "Textiles",
    collection: "best-sellers",
    price: 96,
    description:
      "A square linen cushion in muted clay. Hidden zip, generously filled with a feather-down insert.",
    details: ["Linen cover with feather-down insert", "Hidden YKK zip", "55 × 55 cm"],
    images: ["/images/products/pillow.jpg", "/images/products/throw.jpg"],
    variants: [
      { name: "Color", options: ["Clay", "Oat", "Ink"] },
      { name: "Size", options: ["50cm", "55cm", "65cm"] },
    ],
    reviews: sharedReviews,
    faqs: sharedFaqs,
  },
  {
    slug: "oka-tray",
    name: "Oka Walnut Tray",
    category: "Living",
    collection: "new-arrivals",
    price: 128,
    description:
      "Turned from a single piece of solid walnut. Substantial enough for a morning ritual, beautiful enough to leave out.",
    details: ["Solid walnut, food-safe oil finish", "Diameter 38 cm"],
    images: ["/images/products/tray.jpg", "/images/products/bowl.jpg"],
    variants: [{ name: "Size", options: ["Small", "Large"] }],
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
