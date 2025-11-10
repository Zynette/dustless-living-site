// api/create-checkout-session.js
// Vercel/Netlify-style serverless function for Stripe Checkout
// Creates a deposit payment session and marks booking deposit as "pending"

const Stripe = require("stripe");
const { Firestore } = require("@google-cloud/firestore");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const firestore = new Firestore({
  projectId: process.env.FIREBASE_PROJECT_ID,
  credentials: {
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
});

module.exports = async (req, res) => {
  // Basic CORS (optional, adjust for your host)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { bookingId, depositAmount } = req.body || {};

    if (!bookingId || !depositAmount) {
      return res
        .status(400)
        .json({ error: "Missing bookingId or depositAmount" });
    }

    const amountNumber = Number(depositAmount);
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      return res.status(400).json({ error: "Invalid depositAmount" });
    }

    // Ensure booking exists
    const bookingRef = firestore.collection("bookings").doc(bookingId);
    const bookingSnap = await bookingRef.get();
    if (!bookingSnap.exists) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const booking = bookingSnap.data();
    const safeAmount = Math.max(2000, Math.round(amountNumber * 100)); // min $20 CAD

    // Mark booking as deposit pending
    await bookingRef.update({
      depositAmount: safeAmount / 100,
      depositStatus: booking.depositStatus === "paid" ? "paid" : "pending",
    });

    const baseUrl = process.env.SITE_URL || "https://dustless-living-site.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: "Dustless Living Cleaning Deposit",
              description: `Booking ID: ${bookingId}`,
            },
            unit_amount: safeAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/?payment=success&bookingId=${encodeURIComponent(
        bookingId
      )}`,
      cancel_url: `${baseUrl}/?payment=cancel&bookingId=${encodeURIComponent(
        bookingId
      )}`,
      metadata: {
        bookingId,
      },
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error("Stripe create session error:", err);
    return res.status(500).json({ error: "Unable to create session" });
  }
};