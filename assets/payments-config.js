/* ===================================================================
 * PAYMENTS CONFIG — see /PAYMENTS-README.md for switch-over steps.
 * mode:
 *   "demo"                    → no charge, shows "Demo - no payment taken" (current)
 *   "stripe-payment-link"     → redirect to the owner's Stripe Payment Links below
 *   "square-payment-link"     → redirect to the owner's Square payment links below
 *   "stripe-checkout-session" → POST order to YOUR serverless endpoint that creates a
 *                               Stripe Checkout Session for the exact amount; redirect to its url
 * Card / Apple Pay / Google Pay / PayPal are all handled on the processor's hosted page
 * once a live mode is selected — no card data ever touches this site.
 * =================================================================== */
window.MS_PAYMENTS = {
  mode: "demo",
  shopEmail: "info@metrosportsnh.com",
  stripe: {
    depositLink: "",   // e.g. https://buy.stripe.com/xxxx  (customer-chooses-amount or fixed deposit)
    payNowLink: "",    // e.g. https://buy.stripe.com/yyyy
    checkoutSessionEndpoint: "" // e.g. https://<your-function>/create-checkout-session
  },
  square: {
    depositLink: "",   // e.g. https://square.link/u/xxxx
    payNowLink: ""
  }
};
