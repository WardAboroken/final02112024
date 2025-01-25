const bcrypt = require("bcryptjs"); // Import bcryptjs for password comparison
const doQuery = require("../query");

// Function to check user type based on credentials
async function checkUserType(userInfo) {
  const { userName, psw } = userInfo; // psw is the plain text password entered by the user

  try {
    // SQL query to check if user exists in either 'users' or 'businessowner' table
    const results = await doQuery(
      `SELECT 'normal' AS userType, psw
      FROM users
      WHERE userName = ?
      UNION
      SELECT typeOfUser AS userType, psw
      FROM businessowner
      WHERE userName = ?
    `,
      [userName, userName] // Only passing the userName, not the password, to the query
    );

    // Check if results were returned
    if (results.length > 0) {
      const dbPasswordHash = results[0].psw; // The hashed password from the database
      const userType = results[0].userType; // The user type (either 'normal' or the typeOfUser from businessowner)

      // Compare the plain text password with the hashed password from the database
      const isMatch = await bcrypt.compare(psw, dbPasswordHash);

      if (isMatch) {
        return userType; // If passwords match, return the user type
      } else {
        return null; // Passwords don't match
      }
    } else {
      return null; // User not found in either table
    }
  } catch (error) {
    console.error("Error checking user type:", error);
    throw error; // Propagate error for handling elsewhere
  }
}

// Export the function to make it accessible to other parts of your application
module.exports = checkUserType;
