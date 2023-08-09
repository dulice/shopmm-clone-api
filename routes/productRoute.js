const { createProduct, getProducts, categoriesWithImage, sameCategoryProducts, searchProduct, product, writeReview, updateProduct, deleteProduct } = require("../controllers/productController");
const router = require("express").Router();

router.post("/", createProduct); // create product
router.get("/", getProducts); // get products
router.get("/category", categoriesWithImage); // get category with image
router.get("/categories/:slug", sameCategoryProducts ); // get same category products
router.get("/search", searchProduct); // search product
router.get("/:id", product); // get product
router.put("/:id", updateProduct); // update product
router.delete("/:id", deleteProduct); // delete product
router.put("/review/:id", writeReview) // write review

module.exports = router;
