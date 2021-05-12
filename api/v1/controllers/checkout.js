const catchAsync = require("../../../utils/api/catchAsync");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require('../../../mongodb/models/User');

// @route          GET /api/v1/checkout/create-checkout-session 
// @desc           Create a stripe checkout session
// @accessibility  Private
exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  const { cart, billingData, userId } = req.body;
  const line_items = cart.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          images: [
            `${req.protocol}://${req.get("host")}/img/products/product.png`,
          ],
          description: item.product.summary,
          metadata: { userId, ...billingData },
        },
        unit_amount: item.product.price.toFixed(2) * 100,
      },
      quantity: item.quantity,
    }))
  

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    customer_email: req.user.email,
    billing_address_collection: "required",
    success_url: `${req.protocol}://${req.get(
      "host"
    )}/shop?alert=your order has been placed&type=success`,
    cancel_url: `${req.protocol}://${req.get(
      "host"
    )}/cart?alert=Order cancelled&type=danger`,
  });
  return res.json({
    status: 'success',
    message: 'checkout session initiated',
    data: { sessionId: session.id }
  })
});
  

// @route          GET /api/v1/checkout/place-order
// @desc           place order on successful checkout
// @accessibility  Private

exports.placeOrder = catchAsync( async (req, res, next) => {
  const event = req.body;
  if (event.type === 'checkout.session.completed') {
    const expandedSession = await stripe.checkout.sessions.retrieve(event.data.object.id, {
      expand: ["customer"],
    });
    const line_items = await stripe.sessions.listLineItems(event.data.object.id);
    return res.json({
      status: 'success',
      data : {session: expandedSession, line_items}
    });
  }

  return res.status(400).json({ message: "not a checkout session completion hook" });
})
