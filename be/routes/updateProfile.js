const express = require("express");
const multer = require("multer");
const path = require("path");
const updateCustomerProfile = require("../database/queries/updateCustomerProfile");
const updateShopOwnerProfile = require("../database/queries/updateShopOwnerProfile");

const router = express.Router();
router.use(express.json());

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the directory for uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Use timestamp to avoid file name collisions
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/; // Restrict to image types
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    }
    cb(new Error("Only images (jpeg, jpg, png) are allowed"));
  },
});

// Helper function to format and log user payload
const logPayload = (user) => {
  console.log("User payload received:", JSON.stringify(user, null, 2));
};

// Update customer profile
router.post(
  "/updateCustomerProfile",
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const user = req.body;

      // Attach only the file name if an image is uploaded
      if (req.file) {
        user.profilePicturePath = req.file.filename; // Save only the file name
      }

      logPayload(user);

      const result = await updateCustomerProfile(user);

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: "Customer profile updated successfully!",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: result.message || "Failed to update customer profile.",
        });
      }
    } catch (error) {
      console.error("Error in updating customer profile:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the customer profile.",
      });
    }
  }
);

// Update shop owner profile
router.post(
  "/updateShopOwnerProfile",
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const user = req.body;

      // Attach only the file name if an image is uploaded
      if (req.file) {
        user.profilePicturePath = req.file.filename; // Save only the file name
      }

      logPayload(user);

      const result = await updateShopOwnerProfile(user);

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: "Shop owner profile updated successfully!",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: result.message || "Failed to update shop owner profile.",
        });
      }
    } catch (error) {
      console.error("Error in updating shop owner profile:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the shop owner profile.",
      });
    }
  }
);

module.exports = router;
