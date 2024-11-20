const express = require("express");
const multer = require("multer");
const path = require("path");
const addProduct = require("../database/queries/addProduct");
const updateProductStatus = require("../database/queries/updateProductStatus");
const updateProduct = require("../database/queries/updateProduct");
const doQuery = require("../database/query");
const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post("/addProduct", upload.single("picturePath"), async (req, res) => {
  try {
    console.log("Adding new product:", req.body);
    const product = req.body;
    const picturePath = req.file ? req.file.filename : null;
    product.picturePath = picturePath;

    const result = await addProduct(product);

    if (result.success) {
      res.status(200).json({
        message: "Product added successfully",
        product: result.product,
      });
    } else {
      res
        .status(400)
        .json({ message: result.error || "Product already exists." });
    }
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to update a product
router.put(
  "/updateProduct/:catalogNumber",
  upload.single("picture"),
  async (req, res) => {
    try {
      const { catalogNumber } = req.params;
      const {
        productName,
        description,
        color,
        size,
        amount,
        price,
        categoryNumber,
        status,
      } = req.body;

      const parsedCategoryNumber = categoryNumber
        ? parseInt(categoryNumber, 10)
        : null;

      let picturePath = req.file ? req.file.filename : null;

      if (!picturePath) {
        const currentProduct = await doQuery(
          `SELECT picturePath FROM products WHERE catalogNumber = ?`,
          [catalogNumber]
        );

        if (currentProduct.length > 0) {
          picturePath = currentProduct[0].picturePath;
        }
      }

      const updatedProductData = {
        productName,
        description,
        color,
        size,
        amount,
        price,
        categoryNumber: parsedCategoryNumber,
        picturePath,
        status,
      };

      const result = await updateProduct(catalogNumber, updatedProductData);

      if (result.success) {
        res.status(200).json(result.product);
      } else {
        res.status(400).json({ message: "Product update failed." });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Route to update product status from 'Active' to 'Not Active'
router.put("/updateProductStatus/:catalogNumber", async (req, res) => {
  try {
    const { catalogNumber } = req.params;

    // Call the updateProductStatus function to change the status
    const result = await updateProductStatus({ catalogNumber });

    if (result.success) {
      res.status(200).json({ message: "Product status updated successfully." });
    } else {
      res.status(400).json({ message: result.error || "Product not found." });
    }
  } catch (error) {
    console.error("Error updating product status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
