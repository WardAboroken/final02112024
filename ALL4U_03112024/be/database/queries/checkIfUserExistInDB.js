const doQuery = require("../query");

async function findUser(userInfo) {
  const { email, userName, phoneNumber } = userInfo;
  try {
    const existingUser = await doQuery(
      `SELECT email, username, phoneNumber 
        FROM users 
        WHERE email = ? AND username = ? AND phoneNumber = ? 

        UNION

        SELECT email, username, phoneNumber 
        FROM businessowner 
        WHERE email = ? AND username = ? AND phoneNumber = ?;`,
      [email, userName, phoneNumber, email, userName, phoneNumber]
    );
    if (existingUser.length > 0) {
      return { success: true, message: "User found." };
    } else {
      return { success: false, message: "User not found." };
    }
  } catch (error) {
    return { success: false, message: `Error: ${error.message}` };
  }
}

module.exports = findUser;
