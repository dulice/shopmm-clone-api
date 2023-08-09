const router = require("express").Router();
const cloudinary = require("../cloudinary");

router.post("/profile", async (req, res) => {
  try {
    const { avatar } = req.body;
    const uploadImage = cloudinary.uploader.upload(
      avatar,
      { folder: "ecom/avatars" },
      (error, result) => {
        if (error) {
          console.log(error);
        }
      }
    );
    res.status(200).json(uploadImage.secure_url);
  } catch (err) {
    res.status(500).json({ message: "Image not found." });
  }
});

router.post("/product", async (req, res) => {
  try {
    const urls = [];
    const { images } = req.body;

    images.forEach((file) => {
      urls.push(cloudinary.uploader.upload(file, { folder: "ecom/products" }));
    });
    const response = await Promise.all(urls);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Image not found." });
  }
});

module.exports = router;
