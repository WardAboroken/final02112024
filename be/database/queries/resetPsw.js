const doQuery = require("../query");
const bcrypt = require("bcrypt"); // Import bcrypt

/** A function that updates the password for an existing user, returns success with a successful update, else returns an error
 * @param {*} user
 * @returns success/error
 */
async function findUserForNewPsw(user) {
  const { userName, psw } = user;
  console.log("you check user ", psw);

  try {
    // Check if the user exists
    const resultusers = await doQuery(
      `SELECT username FROM users WHERE username = ?`,
      [userName]
    );
    const resultbis = await doQuery(
      `SELECT username FROM businessowner WHERE username = ?`,
      [userName]
    );

    if (resultusers.length > 0 || resultbis.length > 0) {
      // Hash the new password using bcrypt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(psw, saltRounds);

      if (resultusers.length > 0) {
        // Update password for the user in the 'users' table
        await doQuery(
          `UPDATE users 
           SET psw = ?
           WHERE username = ?`,
          [hashedPassword, userName]
        );
      } else if (resultbis.length > 0) {
        // Update password for the user in the 'businessowner' table
        await doQuery(
          `UPDATE businessowner 
           SET psw = ?
           WHERE username = ?`,
          [hashedPassword, userName]
        );
      }

      return { success: true }; // Password updated successfully
    } else {
      return { error: "User not found" };
    }
  } catch (error) {
    console.error("Error updating user password and finding user:", error);
    return {
      error:
        "An error occurred while updating the password and finding the user",
    };
  }
}

module.exports = findUserForNewPsw;
