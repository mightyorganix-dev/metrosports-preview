/* ===================================================================
 * PRICING CONFIG — the ONLY place prices live. Edit numbers here.
 * !!! SAMPLE / PLACEHOLDER NUMBERS !!!  Metro Sports does not publish
 * prices; every figure below is a made-up example so the estimator can
 * be demonstrated. Replace with the shop's real price sheet before use,
 * then set `sample:false` to remove the "Sample pricing" labels.
 * =================================================================== */
window.MS_PRICING = {
  sample: true,
  sampleLabel: "Sample pricing – shop to confirm",
  currency: "USD",
  depositPercent: 50,            // "Pay deposit" = this % of the estimate

  // Blank garment cost per piece, by category (placeholder)
  garments: {
    "T-shirt":                 { base: 5.00 },
    "Long sleeve tee":         { base: 8.00 },
    "Performance / athletic":  { base: 9.00 },
    "Polo / sport shirt":      { base: 14.00 },
    "Sweatshirt / hoodie":     { base: 16.00 },
    "Jacket / outerwear":      { base: 30.00 },
    "Team uniform top/bottom": { base: 12.00 },
    "Cap / headwear":          { base: 8.00 },
    "Bag / tote":              { base: 10.00 },
    "Customer-supplied item":  { base: 0.00 }
  },

  // Added per piece for larger sizes (placeholder)
  sizeUpcharge: { "2XL": 2.00, "3XL": 3.00 },

  // Decoration pricing per service (placeholder)
  services: {
    "Screen Printing":   { setupPerColor: 20.00, perPiecePerColor: 0.75, perPiecePerLocation: 1.00, usesColors: true },
    "Embroidery":        { setupPerLocation: 35.00, perPiecePerLocation: 6.00, usesColors: false },
    "Heat Applied":      { setupPerLocation: 0.00,  perPiecePerLocation: 4.00, usesColors: false },
    "Direct to Garment": { setupPerLocation: 0.00,  perPiecePerLocation: 7.00, usesColors: false }
  },

  // Discount on per-piece decoration cost by total quantity (placeholder)
  quantityBreaks: [
    { min: 1,   discount: 0.00 },
    { min: 24,  discount: 0.10 },
    { min: 72,  discount: 0.20 },
    { min: 144, discount: 0.30 }
  ],

  sizes: ["YS","YM","YL","YXL","S","M","L","XL","2XL","3XL"],
  locations: ["Front","Back","Left chest","Right chest","Left sleeve","Right sleeve","Hat front","Hat side/back"],
  colors: ["White","Black","Navy","Royal","Red","Maroon","Forest Green","Kelly Green","Orange","Gold","Purple","Sport Grey","Charcoal","Pink","Other (describe in notes)"]
};
