const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Create Stripe Checkout session for shop cart items.
 * Expects body: { items: [{ id, name, price, quantity, subscribe }] }
 */
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { items } = req.body;
    if (!Array.isArray(items) || !items.length) {
      res.status(400).json({ error: 'No items provided' });
      return;
    }

    const line_items = items.map((item) => {
      const unitAmount = Math.round(
        (item.price || 0) * 100 * (item.subscribe ? 0.9 : 1) // 10% off subs
      );
      return {
        price_data: {
          currency: 'cad',
          product_data: {
            name: item.subscribe
              ? `${item.name} (Subscribe & Save)`
              : item.name,
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      const baseUrl = process.env.SITE_URL || 'https://dustlessliving.com';
      success_url: `${baseUrl}/?shop=success`,
      cancel_url: `${baseUrl}/?shop=cancel`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error('Shop checkout error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};