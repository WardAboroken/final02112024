const doQuery = require("../query");

/**
 * A function that updates the status of specific catalog numbers in an order in the orderscontainsproducts table
 * @param {number} orderNumber - The order number to update
 * @param {array} catalogNumbers - An array of catalog numbers to update
 * @param {string} newStatus - The new status to set for the order
 * @returns {Object} - Returns success if updated successfully, otherwise returns an error
 */
async function updateOrderStatus(orderNumber, catalogNumbers, newStatus) {
  try {
    // Convert the catalogNumbers array to a comma-separated string for SQL query
    const catalogNumbersString = catalogNumbers.map(() => "?").join(", "); // Use placeholders for prepared statements

    // Update the status of all specified catalog numbers for the given order number
    await doQuery(
      `UPDATE orderscontainsproducts 
       SET orderStatus = ? 
       WHERE orderNumber = ? 
       AND catalogNumber IN (${catalogNumbersString})`,
      [newStatus, orderNumber, ...catalogNumbers]
    );

    // Check if the order's status was updated for the specified catalog numbers
    const result = await doQuery(
      `SELECT * FROM orderscontainsproducts 
       WHERE orderNumber = ? 
       AND orderStatus = ? 
       AND catalogNumber IN (${catalogNumbersString})`,
      [orderNumber, newStatus, ...catalogNumbers]
    );

    if (result.length > 0) {
      return { success: true }; // Order status updated successfully
    } else {
      return { error: "Order not found or status not updated" };
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    return {
      error: "An error occurred while updating the order status",
    };
  }
}

module.exports = updateOrderStatus;
