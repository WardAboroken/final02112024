// Import the necessary modules or define the function if it's custom
const doQuery = require("../query");

/**
 * A shop function which add a new user to the user table if user does not exist already and returns success if succeeded, else returns error
 * @param {*} user 
 * @returns success/error
 */
async function addUser(user) {
  const { id, username, userpassword, tel, email, date } = user;

  try {
    // Check if the user already exists
    const existingUser = await doQuery(
      `SELECT * FROM users WHERE id = ? OR username = ?`,
      [id, username]
    );
    if (existingUser.length > 0) {
      return { error: "User already exists in the database" }; // Return an error message
    }

    // Insert the user into the database
    const insertSql = `INSERT INTO users (id, username, Psw, phone_number, email, Date_of_birth) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [id, username, userpassword, tel, email, date];
    const result = await doQuery(insertSql, params);

    // Log the result for debugging (optional)
    console.log("Insert result:", result);

    return { success: "New user has been added to the database" }; // Return a success message
  } catch (error) {
    console.error("Error adding user:", error); // Log the error for debugging
    return { error: "Error adding user to the database" }; // Return an error message
  }
}

module.exports = addUser;
