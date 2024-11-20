// checkIfIsNormalUser;
const doQuery = require("../query");

/** A function that returns success if user exists in users table only, else returns error
* @param {*} user
*@returns success/error
 */
async function normalUser(user) {
  const { username, userpassword } = user;

  try {
    // Check if the user exists
    const existingUser = await doQuery(
      `SELECT * FROM users WHERE username = ? AND Psw=? `,
      [username, userpassword]
    );
    if (existingUser.length > 0) {
      return { success: "User found" }; // Return a success message
    } 
       else return { error: "User not found" };
    
  } catch (error) {
    console.error("Error finding user:", error); // Log the error for debugging
    return { error: "Error finding user to the database" }; // Return an error message
  }
}

module.exports = normalUser;
