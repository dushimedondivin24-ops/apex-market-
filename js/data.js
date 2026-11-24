/* Seed data for the APEX MARKET demonstration.
   All names, products, orders and payments are fictional sample data. */
(function () {
  const now = Date.now();
  const day = 86400000;

  const categories = [
    { id: "electronics", name: "Electronics", emoji: "💻", blurb: "Phones, audio & gadgets" },
    { id: "fashion", name: "Fashion", emoji: "👜", blurb: "Shoes, bags & style" },
    { id: "home", name: "Home & Living", emoji: "🏠", blurb: "Decor, kitchen & comfort" },
    { id: "beauty", name: "Beauty & Care", emoji: "✨", blurb: "Skin, hair & wellness" },
    { id: "groceries", name: "Groceries", emoji: "🥭", blurb: "Fresh food & pantry" },
    { id: "sports", name: "Sports & Outdoor", emoji: "🏃", blurb: "Training & adventure" }
  ];

  const sellers = [
    { id: "nova", name: "Nova Electronics", initials: "NE", location: "Bujumbura", rating: 4.9, sales: 1284, verified: true, status: "approved", joined: "2023", color: "#0f766e" },
    { id: "heritage", name: "Heritage Crafts", initials: "HC", location: "Gitega", rating: 4.8, sales: 642, verified: true, status: "approved", joined: "2023", color: "#b45309" },
    { id: "highlands", name: "Burundi Highlands Coffee", initials: "BH", location: "Kayanza", rating: 5.0, sales: 918, verified: true, status: "approved", joined: "2022", color: "#7c2d12" },
    { id: "city", name: "City Steps", initials: "CS", location: "Bujumbura", rating: 4.7, sales: 876, verified: true, status: "approved", joined: "2024", color: "#1d4ed8" },
    { id: "glow", name: "Glow Naturals", initials: "GN", location: "Bujumbura", rating: 4.8, sales: 455, verified: true, status: "approved", joined: "2024", color: "#be185d" },
    { id: "homeco", name: "Home & Co.", initials: "HC", location: "Bujumbura", rating: 4.6, sales: 289, verified: true, status: "approved", joined: "2024", color: "#475569" },
    { id: "farm", name: "Farm Fresh Buja", initials: "FF", location: "Bujumbura", rating: 4.9, sales: 731, verified: true, status: "approved", joined: "2023", color: "#15803d" },
    { id: "kazi", name: "Kazi Sports", initials: "KS", location: "Bujumbura", rating: 4.5, sales: 118, verified: false, status: "pending", joined: "2026", color: "#7e22ce" }
  ];

  const products = [
    {
      id: "p1", name: "Wireless Noise-Cancelling Headphones", category: "electronics", sellerId: "nova",
      price: 189000, oldPrice: 225000, rating: 4.9, reviews: 128, stock: 18, emoji: "🎧",
      gradient: ["#dbeafe", "#e0f2fe"], badge: "Best seller", moderation: "approved",
      description: "Immersive over-ear headphones with active noise cancellation, 40-hour battery life and a comfortable memory-foam fit. Ideal for study, travel and everyday listening.",
      features: ["Active noise cancellation", "Up to 40 hours battery", "Bluetooth 5.3 + wired mode", "Built-in microphone for calls", "1-year local warranty"],
      createdAt: now - day * 26
    },
    {
      id: "p2", name: "Apex Smart Watch Pro", category: "electronics", sellerId: "nova",
      price: 145000, oldPrice: 170000, rating: 4.7, reviews: 86, stock: 7, emoji: "⌚",
      gradient: ["#e0e7ff", "#ede9fe"], badge: "Low stock", moderation: "approved",
      description: "A slim everyday smart watch with heart-rate tracking, sleep insights, notifications and a bright always-on display. Battery lasts up to 10 days.",
      features: ["Heart-rate & sleep tracking", "10-day battery life", "Water resistant (IP68)", "Android & iPhone compatible"],
      createdAt: now - day * 19
    },
    {
      id: "p3", name: "Urban Flex Sneakers", category: "fashion", sellerId: "city",
      price: 78000, oldPrice: 95000, rating: 4.8, reviews: 210, stock: 24, emoji: "👟",
      gradient: ["#fef3c7", "#fde68a"], badge: "Sale", moderation: "approved",
      description: "Lightweight city sneakers with a breathable knit upper and cushioned sole. Designed for long walks, commutes and casual weekends.",
      features: ["Breathable knit upper", "Cushioned EVA sole", "Sizes 38–46", "Easy-care fabric"],
      createdAt: now - day * 14
    },
    {
      id: "p4", name: "Handmade Leather Weekender Bag", category: "fashion", sellerId: "heritage",
      price: 120000, rating: 4.9, reviews: 94, stock: 11, emoji: "👜",
      gradient: ["#f5e6d3", "#ead7bb"], badge: "Handmade", moderation: "approved",
      description: "A roomy weekender handcrafted from full-grain leather by artisans in Gitega. Includes a detachable shoulder strap and a cotton dust bag.",
      features: ["Full-grain leather", "Fits a 15-inch laptop", "Detachable shoulder strap", "Handmade in Burundi"],
      createdAt: now - day * 31
    },
    {
      id: "p5", name: "Handwoven Agaseke Basket", category: "home", sellerId: "heritage",
      price: 35000, rating: 4.9, reviews: 156, stock: 32, emoji: "🧺",
      gradient: ["#fef3c7", "#f5deb3"], badge: "Handmade", moderation: "approved",
      description: "A traditional Burundian agaseke basket woven by local artisans. A beautiful, practical piece for storage, gifting or home decoration.",
      features: ["Woven by local artisans", "Natural sisal fibres", "Approx. 30 cm wide", "Each piece is unique"],
      createdAt: now - day * 41
    },
    {
      id: "p6", name: "Linen Throw Pillow Set", category: "home", sellerId: "homeco",
      price: 32000, rating: 4.6, reviews: 73, stock: 40, emoji: "🛋️",
      gradient: ["#e2e8f0", "#f1f5f9"], badge: "New", moderation: "approved",
      description: "Set of two soft linen-blend cushion covers in warm neutral tones. Hidden zips and a relaxed texture make them an easy upgrade for any sofa.",
      features: ["Set of 2 covers (45 × 45 cm)", "Linen-cotton blend", "Hidden zipper", "Machine washable"],
      createdAt: now - day * 6
    },
    {
      id: "p7", name: "Shea Butter Skincare Set", category: "beauty", sellerId: "glow",
      price: 42000, oldPrice: 52000, rating: 4.8, reviews: 119, stock: 26, emoji: "🧴",
      gradient: ["#fce7f3", "#fbcfe8"], badge: "Sale", moderation: "approved",
      description: "A gentle three-piece routine with shea butter cleanser, body cream and lip balm. Made with natural ingredients for daily hydration.",
      features: ["3-piece gift set", "Shea butter & vitamin E", "Suitable for sensitive skin", "No harsh parabens"],
      createdAt: now - day * 11
    },
    {
      id: "p8", name: "Burundi Highlands Coffee — 1 kg", category: "groceries", sellerId: "highlands",
      price: 28000, rating: 5.0, reviews: 201, stock: 60, emoji: "☕",
      gradient: ["#ede0d4", "#d6bfa8"], badge: "Local favourite", moderation: "approved",
      description: "Freshly roasted arabica beans from the hills of Kayanza. Medium roast with notes of caramel, citrus and cocoa. Whole bean or ground on request.",
      features: ["100% Burundian arabica", "Medium roast", "Roasted to order", "1 kg resealable bag"],
      createdAt: now - day * 22
    },
    {
      id: "p9", name: "Farm Fresh Fruit & Veg Basket", category: "groceries", sellerId: "farm",
      price: 25000, rating: 4.9, reviews: 64, stock: 15, emoji: "🥭",
      gradient: ["#dcfce7", "#bbf7d0"], badge: "New", moderation: "approved",
      description: "A seasonal basket of fruit and vegetables sourced from small farms around Bujumbura. Contents vary with what is freshest each week.",
      features: ["Seasonal selection", "Sourced from local farms", "Delivered fresh", "Contents vary by week"],
      createdAt: now - day * 3
    },
    {
      id: "p10", name: "Apex Phone X200 — 256 GB", category: "electronics", sellerId: "nova",
      price: 620000, oldPrice: 699000, rating: 4.6, reviews: 57, stock: 5, emoji: "📱",
      gradient: ["#cbd5e1", "#e2e8f0"], badge: "Low stock", moderation: "approved",
      description: "A fast, reliable smartphone with a 6.5-inch AMOLED display, 50 MP camera and all-day battery. Unlocked and ready for any local network.",
      features: ["6.5-inch AMOLED display", "256 GB storage / 8 GB RAM", "50 MP dual camera", "5000 mAh battery", "Dual SIM, unlocked"],
      createdAt: now - day * 17
    },
    {
      id: "p11", name: "Mountain Trail Backpack 35 L", category: "sports", sellerId: "city",
      price: 68000, rating: 4.8, reviews: 88, stock: 19, emoji: "🎒",
      gradient: ["#d1fae5", "#a7f3d0"], badge: "New", moderation: "approved",
      description: "A durable 35-litre daypack with a ventilated back panel, rain cover and separate laptop sleeve. Built for trails, commutes and weekend trips.",
      features: ["35 L capacity", "Ventilated back panel", "Included rain cover", "Padded 15-inch laptop sleeve"],
      createdAt: now - day * 8
    },
    {
      id: "p12", name: "Yoga Mat Pro — Non-Slip", category: "sports", sellerId: "city",
      price: 45000, rating: 4.8, reviews: 98, stock: 22, emoji: "🧘",
      gradient: ["#d1fae5", "#ccfbf1"], badge: "Popular", moderation: "approved",
      description: "A 6 mm non-slip yoga mat with alignment lines and a carry strap. Comfortable support for yoga, pilates and home workouts.",
      features: ["6 mm cushioned thickness", "Non-slip textured surface", "Alignment guide lines", "Carry strap included"],
      createdAt: now - day * 13
    },
    {
      id: "p13", name: "Vitamin C Glow Serum", category: "beauty", sellerId: "glow",
      price: 38000, rating: 4.7, reviews: 142, stock: 33, emoji: "🧪",
      gradient: ["#ffedd5", "#fed7aa"], badge: "Popular", moderation: "approved",
      description: "A lightweight brightening serum with vitamin C and hyaluronic acid. Helps even skin tone and lock in moisture without a greasy finish.",
      features: ["Vitamin C + hyaluronic acid", "Lightweight, fast-absorbing", "30 ml glass bottle", "Use morning and evening"],
      createdAt: now - day * 9
    },
    {
      id: "p14", name: "Solar Power Bank 20,000 mAh", category: "electronics", sellerId: "nova",
      price: 55000, rating: 4.5, reviews: 61, stock: 28, emoji: "🔋",
      gradient: ["#fef9c3", "#fde68a"], badge: "Off-grid", moderation: "approved",
      description: "Charge two devices at once with this rugged power bank. Solar top-up and a built-in flashlight make it useful for travel and power cuts.",
      features: ["20,000 mAh capacity", "Solar charging panel", "Dual USB output", "Built-in LED flashlight"],
      createdAt: now - day * 5
    }
  ];

  const reviews = [
    { id: "r1", productId: "p1", name: "Aline N.", rating: 5, text: "The noise cancellation is excellent and the battery really does last for days. Delivery was quick too.", date: now - day * 4 },
    { id: "r2", productId: "p1", name: "Eric M.", rating: 4, text: "Great sound for the price. The case could be a little smaller, but I'm very happy overall.", date: now - day * 12 },
    { id: "r3", productId: "p3", name: "Claudine I.", rating: 5, text: "Very comfortable for walking around town. Sizing was accurate.", date: now - day * 6 },
    { id: "r4", productId: "p5", name: "Jean-Paul K.", rating: 5, text: "Beautiful craftsmanship. I bought two as gifts and both were appreciated.", date: now - day * 9 },
    { id: "r5", productId: "p8", name: "Nadia U.", rating: 5, text: "You can really taste the difference. The aroma fills the kitchen when it arrives.", date: now - day * 2 },
    { id: "r6", productId: "p10", name: "Patrick B.", rating: 4, text: "Fast phone with a good screen. Battery life is solid after a week of use.", date: now - day * 7 },
    { id: "r7", productId: "p7", name: "Sandrine H.", rating: 5, text: "My skin feels soft and the set smells lovely. Good value for three products.", date: now - day * 5 },
    { id: "r8", productId: "p12", name: "Yves T.", rating: 5, text: "Stays in place during workouts and is thick enough for my knees.", date: now - day * 3 }
  ];

  const demoOrders = [
    {
      id: "APX-24081", customer: "Aline N.", email: "customer@apexmarket.demo", phone: "+257 79 000 111",
      city: "Bujumbura", address: "Rohero I, Avenue de l'Indépendance", notes: "Call on arrival",
      items: [
        { productId: "p1", name: "Wireless Noise-Cancelling Headphones", price: 189000, qty: 1, sellerId: "nova", emoji: "🎧" },
        { productId: "p7", name: "Shea Butter Skincare Set", price: 42000, qty: 1, sellerId: "glow", emoji: "🧴" }
      ],
      subtotal: 231000, delivery: 0, discount: 0, total: 231000,
      payment: "Mobile Money", paymentStatus: "Paid (sandbox)", status: "Delivered", createdAt: now - day * 4
    },
    {
      id: "APX-24082", customer: "Eric M.", email: "eric@example.com", phone: "+257 76 222 333",
      city: "Bujumbura", address: "Mutanga Sud, near the university", notes: "",
      items: [
        { productId: "p3", name: "Urban Flex Sneakers", price: 78000, qty: 2, sellerId: "city", emoji: "👟" },
        { productId: "p8", name: "Burundi Highlands Coffee — 1 kg", price: 28000, qty: 1, sellerId: "highlands", emoji: "☕" }
      ],
      subtotal: 184000, delivery: 0, discount: 0, total: 184000,
      payment: "Mobile Money", paymentStatus: "Paid (sandbox)", status: "Shipped", createdAt: now - day * 2
    },
    {
      id: "APX-24083", customer: "Claudine I.", email: "claudine@example.com", phone: "+257 71 444 555",
      city: "Gitega", address: "Quartier Magarama", notes: "Deliver after 4 pm",
      items: [
        { productId: "p5", name: "Handwoven Agaseke Basket", price: 35000, qty: 2, sellerId: "heritage", emoji: "🧺" },
        { productId: "p9", name: "Farm Fresh Fruit & Veg Basket", price: 25000, qty: 1, sellerId: "farm", emoji: "🥭" }
      ],
      subtotal: 95000, delivery: 3000, discount: 0, total: 98000,
      payment: "Cash on delivery", paymentStatus: "Pending", status: "Confirmed", createdAt: now - day
    },
    {
      id: "APX-24084", customer: "DUSHIME Don Divin", email: "customer@apexmarket.demo", phone: "+257 68 777 888",
      city: "Bujumbura", address: "Kinindo, near the lake", notes: "",
      items: [
        { productId: "p10", name: "Apex Phone X200 — 256 GB", price: 620000, qty: 1, sellerId: "nova", emoji: "📱" }
      ],
      subtotal: 620000, delivery: 0, discount: 0, total: 620000,
      payment: "Card (sandbox)", paymentStatus: "Paid (sandbox)", status: "Pending", createdAt: now - 21600000
    }
  ];

  const monthly = [
    { label: "Jun", value: 6.4 },
    { label: "Jul", value: 7.8 },
    { label: "Aug", value: 7.1 },
    { label: "Sep", value: 9.2 },
    { label: "Oct", value: 10.6 },
    { label: "Nov", value: 12.4 }
  ];

  window.APEX_SEED = { categories, sellers, products, reviews, demoOrders, monthly };
})();
