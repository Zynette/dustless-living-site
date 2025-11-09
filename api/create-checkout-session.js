const Stripe = require('stripe');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { bookingId, depositAmount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: 'Dustless Living Cleaning Deposit',
              description: `Booking ID: ${bookingId}`
            },
            unit_amount: depositAmount * 100
          },
          quantity: 1
        }
      ],
      success_url: 'https://dustless-living-site.vercel.app/?payment=success',
      cancel_url: 'https://dustless-living-site.vercel.app/?payment=cancel',
      metadata: { bookingId }
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error('Stripe create session error:', err);
    res.status(500).json({ error: 'Unable to create session' });
  }
};