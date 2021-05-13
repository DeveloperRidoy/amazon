const catchAsync = require("../../../utils/api/catchAsync");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../../../mongodb/models/Order");
const Product = require("../../../mongodb/models/Product");

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
        images: [`${req.protocol}://${req.get("host")}/img/products/${item.product.coverPhoto}`],
        description: item.product.summary
      },
      unit_amount_decimal: (item.product.price * 100).toFixed(2),
    },
    quantity: item.quantity,
  }));
  

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    customer_email: req.user.email,
    client_reference_id: userId,
    metadata: billingData,
    success_url: `${req.protocol}://${req.get(
      "host"
    )}/shop?alert=your order has been placed&type=success&emptyCart=true`,
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

  // check if it's a successful checkout session 
  if (event.type !== 'checkout.session.completed') {
    return res
      .status(400)
      .json({ message: "not a checkout session completion hook" });
  }

  // expand line_items to get products info
  const expandedEvent = await stripe.checkout.sessions.retrieve(event.data.object.id, {expand: ['line_items']});

  // collect necessary info to place order in database
  const products = (await Product.find({ $or: expandedEvent.line_items.data.map(item => ({ name: item.description })) })).map(item => {
    const product = expandedEvent.line_items.data.find(product => product.description === item.name);
    return {
      product: item._id,
      quantity: product.quantity,
      price: product.price.unit_amount_decimal,
      totalPrice: product.amount_total
    };
  });
  
  // place order 
  await Order.create({user: expandedEvent.client_reference_id, products})

  // return response
  return res.json({
    status: 'success',
    message: 'Order received!'
  });
})
