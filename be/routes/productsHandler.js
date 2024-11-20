// Import necessary modules
const express = require("express");
const multer = require("multer");
const path = require("path");

// Import custom query functions for product operations
const addProduct = require("../database/queries/addProduct");
const updateProductStatus = require("../database/queries/updateProductStatus");
const updateProduct = require("../database/queries/updateProduct");
const doQuery = require("../database/query");

const router = express.Router(); // Initialize router

// Configure Multer for file uploads
const storage = multer.diskStorage({
  // Set the destination for storing uploaded files
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // Store in /uploads directory
  },
  // Configure filename to be a timestamp with the original extension
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage }); // Initialize multer with storage configuration

// Route to add a new product
router.post("/addProduct", upload.single("picturePath"), async (req, res) => {
  try {
    console.log("Adding new product:", req.body); // Log the incoming request body for debugging
    const product = req.body; // Extract product details from the request body
    const picturePath = req.file ? req.file.filename : null; // Get uploaded file path if available
    product.picturePath = picturePath; // Assign file path to product object

    const result = await addProduct(product); // Call addProduct function to save product in database

    if (result.success) {
      // If successful, return a success message with product details
      res.status(200).json({
        message: "Product added successfully",
        product: result.product,
      });
    } else {
      // If product already exists, return a 400 status with an error message
      res
        .status(400)
        .json({ message: result.error || "Product already exists." });
    }
  } catch (error) {
    console.error("Error adding product:", error); // Log any error
    res.status(500).json({ error: "Internal Server Error" }); // Return a 500 status for internal errors
  }
});

// Route to update an existing product
router.put(
  "/updateProduct/:catalogNumber",
  upload.single("picture"),
  async (req, res) => {
    try {
      const { catalogNumber } = req.params; // Extract catalogNumber from URL parameters
      const {
        productName,
        description,
        color,
        size,
        amount,
        price,
        categoryNumber,
        status,
      } = req.body; // Destructure properties from the request body

      // Parse category number as an integer if provided
      const parsedCategoryNumber = categoryNumber
        ? parseInt(categoryNumber, 10)
        : null;

      // If a new image is uploaded, use its filename, otherwise retrieve the existing picture path
      let picturePath = req.file ? req.file.filename : null;

      if (!picturePath) {
        // Query the current product for its existing picturePath if no new image is uploaded
        const currentProduct = await doQuery(
          `SELECT picturePath FROM products WHERE catalogNumber = ?`,
          [catalogNumber]
        );

        if (currentProduct.length > 0) {
          picturePath = currentProduct[0].picturePath; // Use the existing picture path if available
        }
      }

      // Prepare updated product data with the new or existing picture path
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

      // Call updateProduct to update product details in the database
      const result = await updateProduct(catalogNumber, updatedProductData);

      if (result.success) {
        res.status(200).json(result.product); // Return updated product details if successful
      } else {
        res.status(400).json({ message: "Product update failed." }); // Return an error message if update fails
      }
    } catch (error) {
      console.error("Error updating product:", error); // Log any error
      res.status(500).json({ error: "Internal Server Error" }); // Return a 500 status for internal errors
    }
  }
);

// Route to update product status (e.g., change from 'Active' to 'Not Active')
router.put("/updateProductStatus/:catalogNumber", async (req, res) => {
  try {
    const { catalogNumber } = req.params; // Extract catalogNumber from URL parameters

    // Call updateProductStatus to change product status in the database
    const result = await updateProductStatus({ catalogNumber });

    if (result.success) {
      res.status(200).json({ message: "Product status updated successfully." }); // Return success message if successful
    } else {
      res.status(400).json({ message: result.error || "Product not found." }); // Return an error message if product not found
    }
  } catch (error) {
    console.error("Error updating product status:", error); // Log any error
    res.status(500).json({ error: "Internal Server Error" }); // Return a 500 status for internal errors
  }
});

module.exports = router; // Export the router for use in the main app
