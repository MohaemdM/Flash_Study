import { loadStripe } from "@stripe/stripe-js";
let stripe;
const getStripe = async () => {
    if (!stripePromise) {
        stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
    }
    return stripePromise;
};
export default getStripe;