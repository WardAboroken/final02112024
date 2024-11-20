// be/database/queries/getCustomerInfo.js
// Import your database query function (doQuery) here
const doQuery = require("../query");

// Function to check user type based on credentials
async function getCustomerInfo(userInfo) {

  const { userName } = userInfo;
  try {
    // SQL query to check if user exists in the 'users' table
    const results = await doQuery(
      `SELECT *
      FROM users
      WHERE userName = ?
   `,
      [userName]
    );

    if (results.length > 0) {
      console.log(results[0])
      return results[0]; // Assuming 'users' table has fields like name, username, email, etc.
    } else {
      return null; // Return null if user is not found
    }
  } catch (error) {
    console.error("Error returning customer's info:", error);
    throw error; // Propagate error for handling elsewhere
  }
}

// Export the function to make it accessible to other parts of your application
module.exports = getCustomerInfo;
