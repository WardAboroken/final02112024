const bcrypt = require("bcryptjs"); // Import bcryptjs for password hashing
const doQuery = require("../query");

async function addUserCustomer(user) {
  const {
    userName,
    name,
    password,
    email,
    phoneNumber,
    selectedCategories,
    address, // Add address here
  } = user;

  try {
    // Check if the user already exists
    const existingUser = await doQuery(
      ` SELECT * FROM users WHERE userName = ? OR email = ?`,
      [userName, email]
    );

    if (existingUser.length > 0) {
      return { success: false, message: "User already exists" };
    }

    // Hash the password using bcryptjs
    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    // Insert new user into the database with the hashed password and address
    await doQuery(
      `INSERT INTO users (userName, name, psw, email, phoneNumber, preferredCategories, address) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userName,
        name,
        hashedPassword, // Store the hashed password
        email,
        phoneNumber,
        JSON.stringify(selectedCategories), // Store categories as a JSON string
        address, // Store the address
      ]
    );

    return { success: true, message: "User added successfully" };
  } catch (error) {
    console.error("Error adding user:", error);
    return { success: false, message: "Error adding user to the database" };
  }
}

module.exports = addUserCustomer;