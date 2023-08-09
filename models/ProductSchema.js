const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
  reviewerName: { type: String },
  comment: { type: String, required: true, },
  rating: { type: Number, default: 0, },
});

const productSchema = mongoose.Schema({
    ownerId: {type: String, required: true  },
    ownerName: {type: String, required: true},
    productName: { type: String, required: true, },
    category: { type: String, required: true, },
    subCategory: { type: String},
    slug: { type: String },
    price: { type: Number, required: [true, "Please enter Price."], },
    stock: { type: Number, required: true, },
    images: { type: Array, default: [], },
    description: { type: String, required: true, },
    rating: { type: Number, default: 0, },
    reviews: [reviewSchema],
    discount: {
      type: Number,
      default: 0
    },
    fromDate: {
      type: Date,
    },
    toDate: {
      type: Date,
    }
},{ timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;