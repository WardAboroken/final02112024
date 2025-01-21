const doQuery = require("../query");
const bcrypt = require("bcrypt");
const findUser = require("../queries/findUser");

async function updateCustomerProfile(user) {
  const {
    name,
    userName,
    email,
    phoneNumber,
    password, // Optional for profile picture update
    newPassword,
    preferredCategories,
    city,
    street,
    profilePicturePath,
  } = user;

  try {
    if (!userName) {
      return { success: false, message: "userName is required." };
    }

    // Dynamically build the query based on provided fields
    let sql = "UPDATE users SET ";
    const params = [];

    if (name) {
      sql += "name = ?, ";
      params.push(name);
    }
    if (email) {
      sql += "email = ?, ";
      params.push(email);
    }
    if (phoneNumber) {
      sql += "phoneNumber = ?, ";
      params.push(phoneNumber);
    }
    if (preferredCategories) {
      const categories = Array.isArray(preferredCategories)
        ? JSON.stringify(preferredCategories)
        : preferredCategories;
      sql += "preferredCategories = ?, ";
      params.push(categories);
    }
     if (city || street) {
       const address = `city :  ${city || ""}  /  street : ${street || ""}`.trim();
       sql += "address = ?, ";
       params.push(address);
     }
    if (profilePicturePath) {
      sql += "profilePicturePath = ?, ";
      params.push(profilePicturePath);
    }
    if (newPassword) {
      if (!password) {
        return { success: false, message: "Current password is required." };
      }

      const userinfo = { userName, psw: password };
      const findResult = await findUser(userinfo);

      if (!findResult.success) {
        return { success: false, message: "Invalid current password." };
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      sql += "psw = ?, ";
      params.push(hashedPassword);
    }

    // Remove the trailing comma and space
    sql = sql.slice(0, -2);

    // Add WHERE clause
    sql += " WHERE userName = ?";
    params.push(userName);

    // Execute the query
    await doQuery(sql, params);

    return { success: true, message: "User updated successfully." };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, message: "Error updating user in the database." };
  }
}

module.exports = updateCustomerProfile;
