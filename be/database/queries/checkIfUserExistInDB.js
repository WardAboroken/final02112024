const doQuery = require("../query"); // Import the database query function

// Define an asynchronous function to find a user in either `users` or `businessowner` tables
async function findUser(userInfo) {
  // Destructure the necessary user information from the passed object
  const { email, userName, phoneNumber } = userInfo;

  try {
    // Query both `users` and `businessowner` tables to check for a matching user
    const existingUser = await doQuery(
      `SELECT email, username, phoneNumber 
        FROM users 
        WHERE email = ? AND username = ? AND phoneNumber = ? 

        UNION

        SELECT email, username, phoneNumber 
        FROM businessowner 
        WHERE email = ? AND username = ? AND phoneNumber = ?;`,
      // Bind the parameters for both `users` and `businessowner` tables
      [email, userName, phoneNumber, email, userName, phoneNumber]
    );

    // Check if a user was found
    if (existingUser.length > 0) {
      return { success: true, message: "User found." }; // Return success if user is found
    } else {
      return { success: false, message: "User not found." }; // Return not found if no match
    }
  } catch (error) {
    // Handle any errors that occur during the query
    return { success: false, message: `Error: ${error.message}` };
  }
}

module.exports = findUser; // Export the findUser function for external use
