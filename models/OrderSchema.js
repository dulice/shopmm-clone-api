const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    customerId: { type: String, require: true},
    items: { type: Array, default: [] },
    productsPrice: { type: Number, require: true },
    shippingFees: { type: Number, require: true },
    totalPrice: { type: Number, require: true},
    address: { type: Object, require: true },
    isPaid: {type: Boolean, default: false},
    isDelivered: {type: String, default: "pending" },
},{ timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;