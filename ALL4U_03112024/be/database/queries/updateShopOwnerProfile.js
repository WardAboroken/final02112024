const doQuery = require("../query");
const bcrypt = require("bcrypt");

async function updateShopOwnerProfile(shopOwner) {
  const {
    name,
    phoneNumber,
    password,
    newPassword,
    businessName,
    businessAddress,
    description,
    paypalEmail,
  } = shopOwner;

  try {
    console.log("Updating shop owner profile");

    // Hash the new password before updating, if the new password is provided
    let hashedPassword = null;
    if (newPassword) {
      hashedPassword = await bcrypt.hash(newPassword, 10); // 10 is the salt rounds
    }

    // Update shop owner in the database, excluding status, userName, and email
    const sql = `
      UPDATE businessowner 
      SET 
        name = ?, 
        phoneNumber = ?, 
        psw = ?, 
        businessName = ?, 
        businessAddress = ?, 
        description = ? ,
        paypalEmail = ? 
      WHERE userName = ?
    `;

    const params = [
      name,
      phoneNumber,
      hashedPassword || password, // Use the existing password if new one isn't provided
      businessName,
      businessAddress,
      description,
      paypalEmail,
      shopOwner.userName, // This is used only for the WHERE clause and not modified
    ];

    await doQuery(sql, params);

    return { success: true, message: "Shop owner updated successfully" };
  } catch (error) {
    console.error("Error updating shop owner:", error);
    return {
      success: false,
      message: "Error updating shop owner in the database",
    };
  }
}

module.exports = updateShopOwnerProfile;
