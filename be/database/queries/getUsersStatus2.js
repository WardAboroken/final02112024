const doQuery = require("../query");

async function getAllUsers() {
  const sql = `SELECT name, userName, email, phoneNumber, typeOfUser, subscriptionType, businessName, businessAddress, description, status FROM businessowner`; // Exclude psw field
  try {
    const result = await doQuery(sql);
    return result;
  } catch (error) {
    console.error("Error fetching all users:", error); // Log error for debugging
    throw error; // Propagate the error for proper handling
  }
}

// Function to fetch users with status = 2 (Waiting)
async function getUsersStatus2() {
  const sql = `SELECT name, userName, email, phoneNumber, typeOfUser, subscriptionType, businessName, businessAddress, description, status FROM businessowner WHERE status = 2`; // Exclude psw field
  try {
    const result = await doQuery(sql);
    return result;
  } catch (error) {
    console.error("Error fetching users:", error); // Log error for debugging
    throw error; // Propagate the error for proper handling
  }
}

// Function to fetch users with status = 1 (Active)
async function getUsersStatus1() {
  const sql = `SELECT name, userName, email, phoneNumber, typeOfUser, subscriptionType, businessName, businessAddress, description, status FROM businessowner WHERE status = 1`; // Exclude psw field
  try {
    const result = await doQuery(sql);
    return result;
  } catch (error) {
    console.error("Error fetching users:", error); // Log error for debugging
    throw error; // Propagate the error for proper handling
  }
}

// Function to fetch users with status = 0 (Not Active)
async function getUsersStatus0() {
  const sql = `SELECT name, userName, email, phoneNumber, typeOfUser, subscriptionType, businessName, businessAddress, description, status FROM businessowner WHERE status = 0`; // Exclude psw field
  try {
    const result = await doQuery(sql);
    return result;
  } catch (error) {
    console.error("Error fetching users:", error); // Log error for debugging
    throw error; // Propagate the error for proper handling
  }
}

// Function to update user status
async function updateStatus(userName, newStatus) {
  try {
    console.log(
      `Attempting to update user: ${userName} to status: ${newStatus}`
    ); // Debugging log

    const updateSql = `UPDATE businessowner SET status = ? WHERE userName = ?`;
    const params = [newStatus, userName];
    const result = await doQuery(updateSql, params);

    console.log("Update result:", result); // Log the result for debugging

    if (result.affectedRows > 0) {
      return { success: "User status has been updated in the database" }; // Return a success message
    } else {
      return { error: "No rows were affected; user might not exist" }; // Return an error message if no rows were updated
    }
  } catch (error) {
    console.error("Error updating user status:", error); // Log the error for debugging
    return { error: "Error updating user status in the database" }; // Return an error message
  }
}

module.exports = {
  getUsersStatus2,
  getUsersStatus1,
  getUsersStatus0,
  updateStatus,
  getAllUsers,
};
