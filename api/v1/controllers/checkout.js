const catchAsync = require("../../../utils/api/catchAsync");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// @route          GET /api/v1/create-checkout-session 
// @desc           Create a stripe checkout session
// @accessibility  Private
exports.createCheckoutSession = catchAsync(async (req, res, next) => {
    const { cart, billingData } = req.body;

    const line_items = cart.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          images: item.product.photos,
        },
        unit_amount: item.product.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        customer_email: req.user.email,
        success_url: `${process.env.NEXT_PUBLIC_WEBSITE}/shop?alert=your order has been placed&type=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_WEBSITE}/cart?alert=Order cancelled&type=danger`
    })

    return res.json({
        status: 'success',
        message: 'checkout session initiated',
        data: {sessionId: session.id}
    })
});
  