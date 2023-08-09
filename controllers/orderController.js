require("dotenv").config();
const { sendMail } = require("../mail");
const Order = require("../models/OrderSchema");
const User = require("../models/UserSchema");
const Product = require("../models/ProductSchema");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const orderSummary = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSale: { $sum: "$totalPrice" },
          numberOfOrders: { $sum: 1 },
        },
      },
    ]);

    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSale: { $sum: "$totalPrice" },
          numberOfOrders: { $sum: 1 },
        },
      },
    ]);

    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numberOfUsers: { $sum: 1 },
        },
      },
    ]);

    const products = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          numberOfProducts: { $sum: 1 },
        },
      },
    ]).sort({ createdAt: 1 });

    const totalProducts = await Product.aggregate([
      {
        $group: {
          _id: null,
          numberOfProducts: { $sum: 1 },
        },
      },
    ]);

    res
      .status(200)
      .json({ orders, dailyOrders, users, products, totalProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const payment = async (req, res) => {
  const items = req.body.items.map((item) => {
    _id = item._id;
    ownerId = item.ownerId;
    productName = item.productName;
    slug = item.slug;
    images = item.images;
    discount = item.discount;
    price = item.price;
  });
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
      // cart: JSON.stringify(items)
    },
  });

  const discountAmount = (price, discount) => {
    let result = price - (price * discount) / 100;
    if (discount > 0) {
      return result;
    } else {
      return price;
    }
  };

  const line_items = req.body.items.map((item) => {
    return {
      price_data: {
        currency: "mmk",
        product_data: {
          name: item.productName,
          images: [item.images[0]],
          metadata: {
            id: item._id,
          },
        },
        unit_amount: discountAmount(item.price, item.discount) * 100,
      },
      quantity: item.quantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 2990 * 100,
            currency: "mmk",
          },
          display_name: "Fast shipping",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 2,
            },
            maximum: {
              unit: "business_day",
              value: 3,
            },
          },
        },
      },
    ],
    customer_email: req.body.email,
    line_items,
    mode: "payment",
    success_url: `${CLIENT_URL}/success`,
    cancel_url: `${CLIENT_URL}/checkout`,
  });
  res.send({ url: session.url });
};

const createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    await sendMail(newOrder);
    res.status(200).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({createdAt: -1});
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const customerOrders = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const order = await Order.find({ customerId }).sort({createdAt: -1});
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const order = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deliverOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getUsers,
  orderSummary,
  payment,
  customerOrders,
  order,
  deliverOrder,
};
