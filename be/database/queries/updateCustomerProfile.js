const doQuery = require("../query");
const bcrypt = require("bcrypt");
const findUser = require("../queries/findUser");

async function updateCustomerProfile(user) {
  const {
    name,
    userName,
    email,
    phoneNumber,
    password,
    newPassword,
    preferredCategories, // Array of preferred categories
    address, // New address (city + street)
  } = user;

  try {
    // Find the user by their username and password
    const userinfo = {
      userName: userName,
      psw: password,
    };
    const findResult = await findUser(userinfo);

    console.log("User found for profile update");

    if (!findResult.success) {
      return { success: false, message: "User not found" };
    }

    // Ensure preferredCategories is an array or properly formatted string
    const categories = Array.isArray(preferredCategories)
      ? JSON.stringify(preferredCategories) // Convert array to JSON string
      : preferredCategories; // Use as is if it's already a valid JSON string

    // Start building the SQL query
    let sql = `
      UPDATE users 
      SET name = ?, email = ?, phoneNumber = ?, preferredCategories = ?, address = ?
    `;

    // Prepare the parameters array
    const params = [
      name,
      email,
      phoneNumber,
      categories, // Stored as JSON string in the database
      address, // Add address to be updated
    ];

    // If a new password is provided, include it in the query
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      sql += ` , psw = ?`; // Add password field to the query
      params.push(hashedPassword); // Add hashed password to the parameters
    }

    // Add the WHERE clause to update the correct user
    sql += ` WHERE userName = ?`;
    params.push(userName); // Add userName for the WHERE clause

    // Execute the query
    await doQuery(sql, params);

    return { success: true, message: "User updated successfully" };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, message: "Error updating user in the database" };
  }
}

module.exports = updateCustomerProfile;
