# Payments — demo now, live later

The order builder (`/order/`) and checkout (`/checkout/`) are a **front-end demo**. Right now:

- `assets/payments-config.js` → `mode: "demo"`. Pressing Pay shows **"Demo - no payment taken"**. Nothing is charged, and no card data is collected or sent. The card fields are pre-filled and read-only.
- `assets/pricing-config.js` → `sample: true`. Every price shows **"Sample pricing – shop to confirm"**. All the numbers are placeholders.
- The order data is kept only in the visitor's browser (`sessionStorage`, cleared when the tab closes) so it can be shown on the checkout page.
- The **Bedford team-store PayPal buttons are separate** and unchanged. They post straight to PayPal using the shop's existing hosted button IDs.

## Before going live, the owner must provide
1. **A payment processor account in the shop's own name:** Stripe (stripe.com) or Square (squareup.com). Both handle card, Apple Pay and Google Pay on their hosted page. Stripe can also offer PayPal in supported regions, or keep PayPal separately through the existing PayPal account.
2. **The real price sheet:** blank costs, setup fees, per-color, per-location, size upcharges, quantity breaks and deposit %. Enter these in `assets/pricing-config.js` and set `sample: false`.
3. **Artwork file handling:** today files are only previewed locally, and customers attach them to the email. For real uploads you need storage, for example a form service with uploads (Formspree/Basin/Netlify Forms), Dropbox/Google Drive file requests, or a small serverless function writing to S3/R2.
4. Optional: an **order inbox or form backend** (Formspree, Netlify Forms, Zapier) if orders shouldn't rely on the customer's mail app.

## Option A — Stripe Payment Links (no server, quickest)
Good for a fixed deposit or a "customer enters amount" link.
1. Stripe Dashboard → **Payment Links** → Create link.
   - For a variable deposit, use a product priced as **"Customers choose what to pay"**.
   - In Settings → Payment methods, enable **Apple Pay, Google Pay, Link and cards**. Add PayPal if your account offers it.
   - Under "After payment", set the confirmation page or redirect to `https://<your-site>/checkout/?paid=1`.
2. Copy the links into `assets/payments-config.js`:
   ```js
   mode: "stripe-payment-link",
   stripe: { depositLink: "https://buy.stripe.com/…", payNowLink: "https://buy.stripe.com/…" }
   ```
3. The checkout page redirects to the link and adds `client_reference_id=<order ref>` and `prefilled_email`. The ref appears on the Stripe payment so it can be matched to the emailed order.
4. Apple Pay on Payment Links needs no domain verification, because it runs on Stripe's domain.

## Option B — Square payment links (no server)
1. Square Dashboard → **Online Checkout → Payment links** → create a link (fixed amount, or "Customers pay what they want"). Enable Apple Pay, Google Pay and Cash App Pay.
2. In `payments-config.js`:
   ```js
   mode: "square-payment-link",
   square: { depositLink: "https://square.link/u/…", payNowLink: "https://square.link/u/…" }
   ```
3. Customers put the order ref in the note field. Square links don't accept a reference parameter.

## Option C — Stripe Checkout Session (exact amount per order; needs a tiny server function)
1. Deploy one serverless function (Netlify/Vercel/Cloudflare Workers) holding the **secret key as an environment variable**. Never put it in this site's files. The function:
   - receives `{ref, kind, amountCents, email, summary}`
   - **recomputes the price server-side from the same price sheet.** Never trust the browser's amount.
   - calls `stripe.checkout.sessions.create({ mode:"payment", line_items:[{price_data:{currency:"usd", unit_amount, product_data:{name:"Metro Sports order "+ref}}, quantity:1}], customer_email:email, client_reference_id:ref, success_url, cancel_url })`
   - returns `{ url: session.url }`
2. In `payments-config.js`:
   ```js
   mode: "stripe-checkout-session",
   stripe: { checkoutSessionEndpoint: "https://<function-url>/create-checkout-session" }
   ```
3. Turn on Apple Pay / Google Pay in the Stripe Dashboard. They appear automatically on Checkout.
4. Optional: add a Stripe webhook (`checkout.session.completed`) to email the shop when a payment lands.

## Switch-back / safety
- Set `mode: "demo"` at any time to disable live payments.
- Remove the "Design preview only" banner and the `noindex` meta only when the owner approves the site for launch.
