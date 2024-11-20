// Import necessary modules
const express = require("express");
const sendRecoveryEmail = require("../utils/sendEmail"); // Import function to send recovery email
const checkIfUserExistInDB = require("../database/queries/checkIfUserExistInDB"); // Check if user exists
const findUserForNewPsw = require("../database/queries/resetPsw"); // Import function for password reset
const router = express.Router(); // Initialize router

// Route to handle password recovery initiation
router.post("/recoveryPsw", async (req, res) => {
  const { email, userName, phoneNumber } = req.body; // Destructure request body data
  const user = req.body;
  const recoveryLink = `http://localhost:3000/ResetPass`; // Define recovery link

  try {
    // Check if user exists in the database
    const result = await checkIfUserExistInDB(user);

    if (result.success) {
      try {
        console.log("The result is:", email);
        // Send recovery email with recovery link
        await sendRecoveryEmail(email, userName, phoneNumber, recoveryLink);
        res.status(200).json({ message: "Recovery email sent successfully!" });
      } catch (error) {
        console.error("Error sending recovery email:", error); // Log error
        res.status(500).json({
          message: "An error occurred while processing your request.",
        });
      }
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error checking user:", error); // Log error
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to handle password reset
router.post("/resetPsw", async (req, res) => {
  console.log("Resetting password for user:", req.body);
  const user = req.body; // Get user data from request body

  try {
    // Execute password reset function
    const result = await findUserForNewPsw(user);

    if (result.success) {
      res.status(200).json({ message: "Reset user password successfully!" });
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error checking user:", error); // Log error
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router; // Export router
