const express = require("express");
const router = express.Router();
const {
  getUsersStatus2,
  getUsersStatus1,
  getUsersStatus0,
  updateStatus,
  getAllUsers,
} = require("../database/queries/getUsersStatus2"); // Ensure correct path
const sendAcception = require("../utils/sendAcception");
const sendRejection = require("../utils/sendRejection");

// Fetch all users (regardless of status)
router.get("/getAllUsers", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error in /getAllUsers GET:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch users with status = 2 (Waiting)
router.get("/getUsersStatus2", async (req, res) => {
  try {
    const users = await getUsersStatus2();
    res.json(users);
  } catch (error) {
    console.error("Error in /getUsersStatus2 GET:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch users with status = 1 (Active)
router.get("/getUsersStatus1", async (req, res) => {
  try {
    const users = await getUsersStatus1();
    res.json(users);
  } catch (error) {
    console.error("Error in /getUsersStatus1 GET:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch users with status = 0 (Not Active)
router.get("/getUsersStatus0", async (req, res) => {
  try {
    const users = await getUsersStatus0();
    res.json(users);
  } catch (error) {
    console.error("Error in /getUsersStatus0 GET:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update user status and send email based on status
router.post("/updateStatus", async (req, res) => {
  const { userName, status, email } = req.body; // Retrieve userName, status, and email from request body
  const recoveryLink = `http://localhost:3000/Login`;

  console.log(
    `Request received to update status for user: ${userName} with status: ${status}`
  ); // Debugging log

  try {
    // Call the updateStatus function with parameters
    const result = await updateStatus(userName, status);

    console.log("Result from updateStatus:", result); // Log after calling updateStatus

    if (result.success) {
      console.log(result.success); // Log success message for debugging

      // Send different emails based on the new status
      try {
        if (status == 1) {
          // Status = 1 (Active)
          await sendAcception(email, userName, recoveryLink);
          console.log("Acception email sent successfully.");
        } else if (status == 0) {
          // Status = 0 (Not Active)
          await sendRejection(email, userName, recoveryLink);
          console.log("Rejection email sent successfully.");
        }
      } catch (emailError) {
        console.error("Error sending email:", emailError);
      }

      res.status(200).json({ message: "Status updated successfully" });
    } else {
      console.error(result.error); // Log error message for debugging
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating status:", error); // Log error for debugging
    res.status(500).json({ message: "Error updating status", error });
  }
});

module.exports = router;
