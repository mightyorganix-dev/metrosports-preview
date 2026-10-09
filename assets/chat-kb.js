/* Metro Sports chat assistant — KNOWLEDGE BASE (edit me).
 * Every answer below uses ONLY facts published on the current metrosportsnh.com site.
 * Anything not published (pricing, turnaround, minimums, hours) routes to "depends on the job" + contact buttons.
 * To swap in a live chat/AI service later, see the "provider" block at the bottom and chat.js -> MSChat.ask().
 */
window.MS_CHAT_KB = {
  shop: {
    name: "Metro Sports",
    since: 1986,
    phone: "(603) 623-3644",
    tel: "tel:+16036233644",
    fax: "(603) 623-5707",
    email: "info@metrosportsnh.com",       // address quote requests go to
    emailAlt: "ryan@metrosportsnh.com",
    address: "1000 East Industrial Park Drive, Manchester, NH 03109",
    landmark: "On the corner of Candia & East Industrial",
    facebook: "https://www.facebook.com/MetroSportsNH",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Metro%20Sports%2C%201000%20East%20Industrial%20Park%20Drive%2C%20Manchester%2C%20NH%2003109"
  },
  greeting: "Hi! I'm the Metro Sports helper. I can tell you what we do, point you to our work and catalogs, or put together a quote request. What can I help with?",
  chips: [
    { label: "Services", intent: "services" },
    { label: "Get a quote", intent: "quote" },
    { label: "Turnaround", intent: "turnaround" },
    { label: "Brands & apparel", intent: "brands" },
    { label: "Team stores", intent: "teamstore" },
    { label: "Contact / location", intent: "contact" }
  ],
  // keyword -> intent (lowercase substrings; first match by score wins)
  keywords: {
    services: ["service","what do you do","screen","print","embroider","stitch","heat","press","digital","dtg","direct to garment","vinyl","decorat","logo"],
    quote: ["quote","estimate","order","bid","request"],
    turnaround: ["turnaround","how long","how fast","rush","when can","ready by","deadline","lead time","days","weeks"],
    pricing: ["price","pricing","cost","how much","cheap","\$","dollar","rate"],
    minimums: ["minimum","min order","how many do i","smallest","one shirt","single"],
    hours: ["hour","open","close","saturday","sunday","weekend","today"],
    brands: ["brand","apparel","catalog","shirt","tee","hoodie","sweatshirt","polo","jacket","hat","cap","bag","tote","gildan","sanmar","augusta","nike","ogio","new era","youth","ladies"],
    teamstore: ["team store","store","bedford","hockey","paypal","buy online","shop"],
    contact: ["contact","phone","call","email","address","where","location","located","directions","map","fax","facebook"],
    work: ["gallery","example","photo","portfolio","sample","work","pictures"],
    history: ["1986","how long have","history","since","about"],
    who: ["school","league","business","organization","team","club","company"]
  },
  answers: {
    services: { text: "Since 1986, Metro Sports has specialized in Screen Printing, Embroidery, Heat Applied and Digital Graphics (including Direct to Garment). You can see real jobs in each gallery:", links: [["Screen Printing","screened.html"],["Embroidery","embroidery.html"],["Heat Applied","heat-applied.html"],["Direct to Garment","direct-to-garment.html"]] },
    turnaround: { text: "Turnaround depends on the job — quantity, garments and decoration method. The best way to get an answer for your date is to ask us directly:", contact: true },
    pricing: { text: "Pricing depends on the job — the garment, quantity, number of colors and print locations. We don't publish a price list, so the quickest way to get a number is a quote:", contact: true, quote: true },
    minimums: { text: "Minimums depend on the job and decoration method, and aren't listed on our site. Reach out and we'll tell you what works for your order:", contact: true, quote: true },
    hours: { text: "Our hours aren't posted online — please call before stopping by and we'll let you know:", contact: true },
    brands: { text: "We carry apparel and accessories from brands including Alstyle, Alternative, American Apparel, Ash City, Augusta Sportswear, Bella, Blue Generation, Boxercraft, Champion Sports, Champro Sports, Charles River Apparel, Cobblestones Activewear, Dodger, Gildan Activewear, Holloway, NES Clothing, Official Issue, Pennant Sportswear, Royal Apparel, SanMar, Soffe, Teamwork Athletic Apparel, Tonix, Tri-Mountain. Browse catalog sheets by category, or see more brands:", links: [["Apparel catalogs","apparel.html"],["Accessories","accessories.html"],["Brands","brands.html"]] },
    teamstore: { text: "We run online team apparel stores — pick your size and check out with PayPal. Currently open: Bedford Middle School Hockey. Want a store for your team? Get in touch.", links: [["Team Apparel Store","team-store.html"]], contact: true },
    contact: { text: "Metro Sports · 1000 East Industrial Park Drive, Manchester, NH 03109 (on the corner of Candia & East Industrial). Phone (603) 623-3644 · Fax (603) 623-5707 · info@metrosportsnh.com · ryan@metrosportsnh.com", links: [["Directions","MAPS"],["Facebook","FACEBOOK"],["Contact page","contact.html"]], contact: true },
    work: { text: "Here's our work, by decoration method:", links: [["Screen Printing","screened.html"],["Embroidery","embroidery.html"],["Heat Applied","heat-applied.html"],["Direct to Garment","direct-to-garment.html"]] },
    history: { text: "Metro Sports has been in business since 1986, working with businesses, leagues, organizations and schools all over Southern New Hampshire." },
    who: { text: "We work with businesses, leagues, organizations and schools all over Southern New Hampshire. Tell us what you need:", quote: true, contact: true },
    fallback: { text: "I don't have that answer here, and I don't want to guess. The team can help directly:", contact: true, quote: true }
  },
  // Quote flow: answers are only used to build an email in the visitor's own mail app. Nothing is stored or sent anywhere else.
  quoteFlow: [
    { key: "name", ask: "Great — let's build a quote request. What's your name?", required: true },
    { key: "contact", ask: "Best phone or email to reach you?", required: true },
    { key: "item", ask: "What item(s)? (e.g. t-shirts, hoodies, hats, polos)", required: true },
    { key: "quantity", ask: "Roughly how many?", required: true },
    { key: "decoration", ask: "Which decoration?", options: ["Screen Printing","Embroidery","Heat Applied","Direct to Garment","Not sure"] },
    { key: "due", ask: "When do you need them by? (date, or 'flexible')", required: false }
  ],
  provider: {
    // "local" = this guided assistant. Later: "crisp" | "tidio" | "llm" (see chat.js for hook points).
    type: "local",
    crisp: { websiteId: "" },
    tidio: { publicKey: "" },
    llm: { endpoint: "", systemPromptFromKB: true }
  }
};
