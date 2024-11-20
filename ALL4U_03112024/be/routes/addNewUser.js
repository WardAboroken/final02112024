const express = require("express");
const addCustomerUser = require("../database/queries/add-user-customer");
const addUserShopOwner = require("../database/queries/addUserShopOwner");
const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// POST /admin/add-user
router.post("/add-user-customer", async (req, res, next) => {
  console.log("Adding new user:", req.body);
  try {
    const user = req.body;
    const result = await addCustomerUser(user);

    // Sending a response to the client
    if (result.success) {
      res.status(200).json({ message: "add User success!" }); // Sending success message if addition is successful
    } else {
      res.status(400).json({ message: "User already exist." }); // Sending error message if user already exists
    }
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "An error occurred while adding the user" });
  }
});

router.post("/addUserShopOwner", async (req, res, next) => {
  console.log("Adding new user:", req.body);
  try {
    const user = req.body;
    console.log("Received user data:", user); // Log the received data
    const result = await addUserShopOwner(user);

    // Sending a response to the client
    if (result.success) {
      res.status(200).json({ message: "add User success!" }); // Sending success message if addition is successful
    } else {
      res.status(400).json({ message: "User already exist." }); // Sending error message if user already exists
    }
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "An error occurred while adding the user" });
  }
});

module.exports = router;
