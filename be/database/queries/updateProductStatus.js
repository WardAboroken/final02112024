const doQuery = require("../query");

/** A function that changes the status of a product to 'Not Active' if it is found in the products table, else returns an error
 * @param {*} product
 * @returns error or success message
 */
async function updateProductStatus({ catalogNumber }) {
  try {
    // Check if the product exists
    const existingProduct = await doQuery(
      `SELECT * FROM products WHERE catalogNumber = ?`,
      [catalogNumber]
    );

    if (existingProduct.length > 0) {
      // Change the status of the product to 'Not Active'
      await doQuery(
        `UPDATE products SET status = 'Not Active' WHERE catalogNumber = ?`,
        [catalogNumber]
      );
      return { success: true };
    } else {
      return { error: "Product not found" };
    }
  } catch (error) {
    console.error("Error updating product status:", error); // Log the error for debugging
    return { error: "Error updating product status in the database" }; // Return an error message
  }
}

module.exports = updateProductStatus;