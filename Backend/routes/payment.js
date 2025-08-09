const express = require('express');
const router = express.Router();
const sql = require('mssql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { connectToDB } = require('../db');
//import Stripe from 'stripe';
const Stripe = require('stripe');
const API_KEY = process.env.API_KEY;


const stripe = new Stripe(API_KEY);

router.get('/', (req, res) => { res.send('Hello World!') });


router.post('/create-checkout-session', async (req, res) => {
    const { monto, tarjeta } = req.body;

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    product_data: {
                        name: 'recarga de saldo',
                        description: `recarga de saldo para la tarjeta: ${tarjeta}`,
                    },
                    currency: 'mxn',
                    unit_amount: monto,
                },
                quantity: 1,
            }
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/api/payment/success',
        cancel_url: 'http://localhost:3000/api/payment/cancel',
    });

    return res.json(session);
});
router.post('/success', async (req, res) => {res.send('success')});
router.post('/cancel', async (req, res) => {res.send('cancel')});


module.exports = router;