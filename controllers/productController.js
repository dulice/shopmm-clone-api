const Product = require("../models/ProductSchema");

const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(200).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, {
      $set: req.body
    },{new: true});
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message});
  }
};

const getProducts = async (req, res) => {
  try {
    const limitNumber = req.query.limit;
    const products = await Product.find()
      .limit(limitNumber)
      .sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json( product );
  } catch (err) {
    res.status(500).json({ message: err });
  }
}

const product = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const categoriesWithImage = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $project: {
          slug: 1,
          firstImage: { $arrayElemAt: ["$images", 0] },
        },
      },
    ]);
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const sameCategoryProducts = async (req, res) => {
  try {
    const slug = req.params.slug;
    const category = await Product.find({ slug });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchProduct = async (req, res) => {
  try {
    const searchQuery = req.query.search;
    const queryFilter = {
      $or: [
        {
          slug: {
            $regex: searchQuery,
            $options: "i",
          },
        },
        {
          subCategory: {
            $regex: searchQuery,
            $options: "i",
          },
        },
        {
          category: {
            $regex: searchQuery,
            $options: "i",
          },
        },
        {
          productName: {
            $regex: searchQuery,
            $options: "i",
          },
        },
      ],
    };
    const product = await Product.find(queryFilter);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const writeReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      const alreadyReview = product.reviews.find(
        (review) => review.user.toString() === req.body.user.toString()
      );
      if (alreadyReview) return res.status(400).json("You already review");
      const reviewer = {
        user: req.body.user,
        reviewerName: req.body.reviewerName,
        comment: req.body.comment,
        rating: req.body.rating,
      };
      product.reviews.push(reviewer);
      product.rating =
        product.reviews.reduce((sum, num) => sum + num.rating, 0) /
        product.reviews.length;
      await product.save();
      res.status(200).json(product);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  categoriesWithImage,
  sameCategoryProducts,
  searchProduct,
  product,
  writeReview,
};
