const doQuery = require("../query");
const bcrypt = require("bcrypt");
const findUser = require("../queries/findUser");


async function updateShopOwnerProfile(shopOwner) {
  const {
    name,
    userName,
    email,
    paypalEmail,
    phoneNumber,
    password, // Current password for verification
    newPassword,
    businessName,
    description,
    merchantId,
    profilePicturePath,
    city,
    street,
  } = shopOwner;

  try {
    if (!userName) {
      return { success: false, message: "userName is required." };
    }

    // Dynamically build the query based on provided fields
    let sql = "UPDATE businessowner SET ";
    const params = [];

    if (name) {
      sql += "name = ?, ";
      params.push(name);
    }
    if (email) {
      sql += "email = ?, ";
      params.push(email);
    }
    if (paypalEmail) {
      sql += "paypalEmail = ?, ";
      params.push(paypalEmail);
    }
    if (phoneNumber) {
      sql += "phoneNumber = ?, ";
      params.push(phoneNumber);
    }
    if (businessName) {
      sql += "businessName = ?, ";
      params.push(businessName);
    }
    if (city || street) {
      const businessAddress = `city :  ${city || ""}  /  street : ${
        street || ""
      }`.trim();
      sql += "businessAddress = ?, ";
      params.push(businessAddress);
    }
  
    if (description) {
      sql += "description = ?, ";
      params.push(description);
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

      // Check if there are fields to update
      if (params.length === 0) {
        return { success: false, message: "No fields to update." };
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

    return { success: true, message: "Shop owner updated successfully." };
  } catch (error) {
    console.error("Error updating shop owner:", error);
    return {
      success: false,
      message: "Error updating shop owner in the database.",
    };
  }
}

module.exports = updateShopOwnerProfile;
