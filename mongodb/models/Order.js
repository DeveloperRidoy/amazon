const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema([{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Order must have a user id']
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: [true, 'product must have a product id']
        },
        quantity: {
            type: Number,
            required: [true, 'product must have a quantity']
        },
        price: {
            type: Number,
            required: [true, 'product must have a price'] 
        },
        totalPrice: {
            type: Number,
            required: [true, 'product must have a total price']
        }

    }]
}])


const Order = mongoose.model('order', OrderSchema);

module.exports = Order;