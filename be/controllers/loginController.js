// be/controllers/loginController.js

// Import necessary modules and functions
const checkUserType = require("../database/queries/login");
const findUser = require("../database/queries/findUser");
const getWorkerInfo = require("../database/queries/getWorkerInfo");
const getCustomerInfo = require("../database/queries/getCustomerInfo");

// Handle user login request
const handleLogin = async (req, res) => {
  try {
    const user = req.body;
    // console.log("Request body:", req.body); // Log entire req.body to inspect structure

    // Check if user exists in the database
    const findResult = await findUser(user);

    if (findResult.success) {
      const userTypeResult = await checkUserType(user);
      let userInfo = {};

      //newwwwwwwwwww
      if (userTypeResult === "normal") {
        const customerInfo = await getCustomerInfo(user);
        if (customerInfo) {
          userInfo = { ...user, ...customerInfo };
        }
      } else if (
        userTypeResult === "admin" ||
        userTypeResult === "businessowner"
      ) {
        const workerInfo = await getWorkerInfo(user);
        if (workerInfo) {
          userInfo = { ...user, ...workerInfo };
        }
      }

      // Determine user type
      // const userTypeResult = await checkUserType(user);
      // req.session.userName = req[1];

      // Store user type in session based on userTypeResult
      if (userTypeResult === "normal") {
        req.session.userType = "normal";
        req.session.userName = user.userName;
        return res.status(200).json({
          message: "User authenticated successfully",
          redirectUrl: "/ShopMainPage", // Redirect URL for normal users
        });
      } else if (userTypeResult === "businessowner" && userInfo.status === 1) {
        req.session.userName = user.userName;
        req.session.userType = "worker";
        return res.status(200).json({
          message: "User authenticated successfully",
          redirectUrl: "/ShopOwnerMainPage", // Redirect URL for workers
        });
      } else if (userTypeResult === "admin" && userInfo.status === 1) {
        req.session.userType = "admin";
        req.session.userName = user.userName;
        return res.status(200).json({
          message: "User authenticated successfully",
          redirectUrl: "/AdminMainPage", // Redirect URL for normal users
        });
      } else {
        return res.status(400).json({ message: "you dont have permission" });
      }
    } else {
      // Send error response if user not found
      console.log("User not found:", findResult.error);
      return res.status(400).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    // Handle errors that occur during user authentication
    console.error("Error finding user:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while finding the user" });
  }
};

// Export the function to make it accessible to your routes or other parts of your application
module.exports = {
  handleLogin,
};
