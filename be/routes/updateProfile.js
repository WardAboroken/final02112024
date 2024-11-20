// A router that connect us to the uppropiate query to help us update the user's profile according to it's type and editing
const express = require("express");
const updateCustomerProfile = require("../database/queries/updateCustomerProfile");
const updateShopOwnerProfile = require("../database/queries/updateShopOwnerProfile");
const router = express.Router();
router.use(express.json());

router.post("/updateCustomerProfile", async (req, res, next) => {
  try {
    const user = req.body;
    const result = await updateCustomerProfile(user);

    // Sending a response to the client
    if (result.success) {
      res.status(200).json({ success: true, message: "Update success!" });
    } else {
      res
        .status(400)
        .json({ success: false, message: result.message || "Update failed." });
    }
  } catch (error) {
    console.error("Error in updating profile:", error);
    res
      .status(500)
      .json({
        success: false,
        error: "An error occurred while updating the user.",
      });
  }
});


// updateShopOwnerProfile
router.post("/updateShopOwnerProfile", async (req, res, next) => {
  try {
    const user = req.body;
    const result = await updateShopOwnerProfile(user);

    // Sending a response to the client
    if (result.success) {
      res.status(200).json({ message: "Update success!" }); // Sending success message if addition is successful
    } else {
      res.status(400).json({ message: "Update faild." }); // Sending error message if user already exists
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while update the user" });
  }
});

module.exports = router;
