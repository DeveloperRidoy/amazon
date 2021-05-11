const catchAsync = require("../../../utils/api/catchAsync");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// @route          GET /api/v1/create-checkout-session 
// @desc           Create a stripe checkout session
// @accessibility  Private
exports.createCheckoutSession = catchAsync(async (req, res, next) => {
    const { cart } = req.body;

    const line_items = cart.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          images: process.env.NODE_ENV === 'development' ? ['https://m.media-amazon.com/images/I/71dHWxX7C0L._AC_UY218_.jpg']: item.product.photos.map(photo => `${req.protocol}://${req.get('host')}/img/products/${photo}`),
        },
        unit_amount: (item.product.price).toFixed(2) * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        customer_email: req.user.email,
        success_url: `${req.protocol}://${req.get('host')}/shop?alert=your order has been placed&type=success`,
        cancel_url: `${req.protocol}://${req.get('host')}/cart?alert=Order cancelled&type=danger`
    })

    return res.json({
        status: 'success',
        message: 'checkout session initiated',
        data: {sessionId: session.id}
    })
});
  