import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const formatAmountForStripe = (amount) => {
    return Math.round(amount * 100);
}

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const session_id = searchParams.get('session_id');

    try {
        const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
        // Handle payment status
        if (checkoutSession.payment_status === 'paid') {
            // Logic to update user subscription status if needed
            return NextResponse.json(checkoutSession);
        } else {
            return NextResponse.json({ error: { message: 'Payment not completed' } }, { status: 400 });
        }
    } catch (err) {
        return NextResponse.json({ error: { message: err.message } }, { status: 500 });
    }
}

export async function POST(req) {
    const params = {
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Pro Subscription',
                    },
                    unit_amount: formatAmountForStripe(10),
                    recurring: {
                        interval: 'month',
                        interval_count: 1,
                    },
                },
                quantity: 1,
            },
        ],
        success_url: `${req.headers.get('origin')}/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get('origin')}/`,
    };

    try {
        const checkoutSession = await stripe.checkout.sessions.create(params);
        return NextResponse.redirect(checkoutSession.url, { status: 303 });
    } catch (err) {
        return NextResponse.json({ error: { message: err.message } }, { status: 500 });
    }
}
