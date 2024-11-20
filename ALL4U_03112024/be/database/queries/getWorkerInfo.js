// be/database/queries/getWorkerInfo.js
// Import your database query function (doQuery) here
const doQuery = require("../query");

// Function to check user type based on credentials
async function getWorkerInfo(userInfo) {

  const { userName } = userInfo;
  try {
    // SQL query to check if user exists in the 'businessowner' table
    const results = await doQuery(
      `SELECT *
      FROM businessowner
      WHERE userName = ? 
   `,
      [userName]
    );

    if (results.length > 0) {
      return results[0]; // Assuming 'businessowner' table has fields like name, username, email, etc.
    } else {
      return null; // Return null if user is not found
    }
  } catch (error) {
    console.error("Error returning worker's info:", error);
    throw error; // Propagate error for handling elsewhere
  }
}

// Export the function to make it accessible to other parts of your application
module.exports = getWorkerInfo;
