const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const stripe = Stripe('YOUR_STRIPE_SECRET_KEY'); // Replace with your Stripe secret key

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // serve HTML, herbs.json, etc.

// Create Stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { lineItems } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems.map(item=>({
        price_data: item.price_data,
        quantity: item.quantity
      })),
      mode: 'payment',
      success_url: `${req.headers.origin}/success.html`,
      cancel_url: `${req.headers.origin}/cart.html`
    });

    res.json({ id: session.id });
  } catch(err){
    console.error(err);
    res.status(500).json({ error: 'Unable to create checkout session' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));
