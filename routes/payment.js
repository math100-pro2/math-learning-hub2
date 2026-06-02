const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');
const User = require('../models/User');
const router = express.Router();

router.post('/create-intent', async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      metadata: { userId }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.STRIPE_PUBLIC_KEY
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/confirm-payment', async (req, res) => {
  try {
    const { userId, paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const user = await User.findById(userId);
      user.isPremium = true;
      user.premiumExpiresAt = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
      await user.save();

      res.json({
        success: true,
        message: 'Payment successful. Premium unlocked!',
        isPremium: user.isPremium
      });
    } else {
      res.status(400).json({ message: 'Payment not successful' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/status/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isActive = user.isPremium && (!user.premiumExpiresAt || new Date() < user.premiumExpiresAt);

    res.json({
      isPremium: isActive,
      expiresAt: user.premiumExpiresAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;