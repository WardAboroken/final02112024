const getCustomerInfo = require("../database/queries/getCustomerInfo");
const getWorkerInfo = require("../database/queries/getWorkerInfo");

// Function to get user information based on the session
const getUserInfo = async (req, res) => {
  try {
    // Check if user session exists
    if (!req.session || !req.session.userName) {
      console.error("User session not found");
      return res.status(401).json({ error: "User session not found" });
    }

    const userType = req.session.userType;
    const userName = req.session.userName; // Ensure userName is defined here

    // Log session details
    console.log("UserName from session:", userName);
    console.log("UserType from session:", userType);

    // Initialize userInfo object
    let userInfo = { userName };

    // Fetch detailed user information based on user type
    if (userType === "normal") {
      console.log("Fetching customer info...");
      const customerInfo = await getCustomerInfo(userInfo);
      if (customerInfo) {
        userInfo = { ...userInfo, ...customerInfo };
      } else {
        console.error("Customer not found");
        return res.status(404).json({ error: "Customer not found" });
      }
    } else if (userType === "worker" || userType === "admin") {
      console.log("Fetching worker info...");
      const workerInfo = await getWorkerInfo(userInfo);
      if (workerInfo) {
        userInfo = { ...userInfo, ...workerInfo };
      } else {
        console.error("Worker or Admin not found");
        return res.status(404).json({ error: "Worker or Admin not found" });
      }
    } else {
      console.error("Invalid user type");
      return res.status(400).json({ error: "Invalid user type" });
    }

    // Send response with user info
    console.log("User info fetched successfully:", userInfo);
    res.status(200).json({ userInfo });
  } catch (error) {
    // Handle errors that occur during fetching or constructing userInfo
    console.error("Error fetching user info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get worker information by userName
 * @param {Object} req - The request object containing params.
 * @param {Object} res - The response object.
 */
const getWorkerInfoByUserName = async (req, res) => {
  try {
    const { userName } = req.params; // Get userName from URL parameters

    if (!userName) {
      return res.status(400).json({ error: "userName parameter is required" });
    }

    console.log("Fetching worker info for userName:", userName);

    const workerInfo = await getWorkerInfo({ userName });

    if (workerInfo) {
      res.status(200).json({ workerInfo });
    } else {
      res.status(404).json({ error: "Worker not found" });
    }
  } catch (error) {
    console.error("Error fetching worker info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Export both functions
module.exports = {
  getUserInfo, // Existing method
  getWorkerInfoByUserName, // New method
};
