const doQuery = require("../query");

/** A function that updates password for existing user, returns success with a successful updating else returns error
 * @param {*} user
 *@returns success/error
 */
async function findUserForNewPsw(user) {
  const { id, username, tel, email, newPassword } = user;
  try {
    // Update the user's password
    await doQuery(
      `UPDATE users 
       SET Psw = ?
       WHERE id = ? 
       AND username = ? 
       AND phone_number = ? 
       AND email = ?`,
      [newPassword, id, username, tel, email]
    );

    // Check if the user exists after updating the password
    const result = await doQuery(
      `SELECT * FROM users 
       WHERE id = ? 
       AND username = ? 
       AND phone_number = ? 
       AND email = ?`,
      [id, username, tel, email]
    );

    if (result.length > 0) {
      return { success: true }; // User found and password updated successfully
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
