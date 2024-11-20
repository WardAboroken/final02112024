const bcrypt = require("bcryptjs"); // Import bcryptjs for password comparison
const doQuery = require("../query");

async function findUser(userInfo) {
  const { userName, psw } = userInfo; // psw is the plain text password entered by the user

  try {
    // Query to retrieve the hashed password (psw) for the given username from both tables
    const result = await doQuery(
      `
      SELECT userName, psw, 'users' AS tableName FROM users WHERE userName = ?
      UNION
      SELECT userName, psw, 'businessowner' AS tableName FROM businessowner WHERE userName = ?
    `,
      [userName, userName] // Only query by userName
    );

    // Check if the user exists in either table
    if (result.length > 0) {
      const dbPasswordHash = result[0].psw; // The hashed password from the database

      // Compare the plain text password with the hashed password in the database
      const isMatch = await bcrypt.compare(psw, dbPasswordHash);

      if (isMatch) {
        
        return { success: true, message: "User found." };
      } else {
        return { success: false, message: "Invalid password." };
      }
    } else {
      return { success: false, message: "User not found." };
    }
  } catch (error) {
    return { success: false, message: `Error: ${error.message}` };
  }
}

module.exports = findUser;