const bcrypt = require("bcryptjs"); // Import bcryptjs for password hashing
const doQuery = require("../query");

async function addShopOwnerUser(user) {
  const {
    name,
    userName,
    email,
    paypalEmail,
    merchantId,
    phoneNumber,
    password, // Plain text password from the user
    subscriptionType,
    businessName,
    businessAddress,
    typeOfUser,
    description,
    status = 2, // Default status
  } = user;

  try {
    console.log("User data in addShopOwnerUser:", user); // Log the user data to check
    // Check if the user already exists
    const existingUser = await doQuery(
      `SELECT * FROM businessowner WHERE userName = ? OR email=?`,
      [userName, email]
    );

    if (existingUser.length > 0) {
      console.log("returnnnnnnnnnnnnn falseeeeeeee");
      return { success: false, message: "User already exists" };
    }

    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    // Insert the new user into the database with the hashed password
    await doQuery(
      `INSERT INTO businessowner (name, userName, email, paypalEmail,phoneNumber, psw, subscriptionType, businessName, businessAddress, typeOfUser, description, status,merchantId)
      VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?,?)`,
      [
        name,
        userName,
        email,
        paypalEmail,
        phoneNumber,
        hashedPassword, // Store the hashed password
        subscriptionType,
        businessName,
        businessAddress,
        typeOfUser,
        description,
        status,
        merchantId,
      ]
    );

    return { success: true };
  } catch (error) {
    console.error("Error adding shop owner user:", error);
    throw error;
  }
}

module.exports = addShopOwnerUser;
