import { Router } from "express";
import Stripe from "stripe";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = Router();

// Creates a Stripe Checkout session for the chosen plan
router.post("/checkout", requireAuth, async (req, res) => {
  try {
    const { plan } = req.body; // "monthly" | "annual"
    const priceId =
      plan === "annual" ? process.env.STRIPE_PRICE_ID_ANNUAL : process.env.STRIPE_PRICE_ID_MONTHLY;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.CLIENT_URL}/pricing?checkout=canceled`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: "Could not start checkout", detail: err.message });
  }
});

// Stripe webhook — keeps subscription status in sync.
// Mount this route with express.raw({type: "application/json"}) in server.js,
// NOT the global express.json() parser, or signature verification will fail.
router.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
  }

  const obj = event.data.object;

  if (event.type === "checkout.session.completed" || event.type === "customer.subscription.updated") {
    const customerId = obj.customer;
    const user = await User.findOne({ stripeCustomerId: customerId });
    if (user) {
      user.subscription.status = "active";
      await user.save();
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const customerId = obj.customer;
    const user = await User.findOne({ stripeCustomerId: customerId });
    if (user) {
      user.subscription.status = "canceled";
      await user.save();
    }
  }

  res.json({ received: true });
});

export default router;
