const express = require("express");
const sendRecoveryEmail = require("../utils/sendEmail"); // Adjust the path as necessary
const checkIfUserExistInDB = require("../database/queries/checkIfUserExistInDB");
const findUserForNewPsw = require("../database/queries/resetPsw")
const router = express.Router();

router.post("/recoveryPsw", async (req, res) => {
  const { email, userName, phoneNumber } = req.body;
  const user = req.body;
  const recoveryLink = `http://localhost:3000/ResetPass`;

  try {
    const result = await checkIfUserExistInDB(user);

    if (result.success) {
      try {
        console.log("The result is:", email);
        await sendRecoveryEmail(email, userName, phoneNumber, recoveryLink);
        res.status(200).json({ message: "Recovery email sent successfully!" });
      } catch (error) {
        console.error("Error sending recovery email:", error);
        res.status(500).json({
          message: "An error occurred while processing your request.",
        });
      }
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/resetPsw", async (req, res) => {
  console.log("Resetting password for user:", req.body);
  // Add your reset password logic here
  const user = req.body;

  try {
    const result = await findUserForNewPsw(user);

    if (result.success) {
      res.status(200).json({ message: "reset user password successfully!" });
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
