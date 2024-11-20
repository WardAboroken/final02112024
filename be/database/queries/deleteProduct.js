const doQuery = require("../query");

/**  A function that deletes product if it was found in the product table, else returns error
 * @param {*} product
 *@returns error
 */
async function deleteProduct(product) {
  const { catalog } = product;

  try {
    // Check if the user exists
    const existingUser = await doQuery(
      `SELECT * FROM products WHERE Catalog_number = ? `,
      [catalog]
    );
    if (existingUser.length > 0) {
      await doQuery(
        `DELETE FROM products
WHERE Catalog_number = ?`,
        [catalog]
      );
      return { success: "delete product success!!!" };
    } else return { error: "product not found" };
  } catch (error) {
    console.error("Error finding product:", error); // Log the error for debugging
    return { error: "Error finding product to the database" }; // Return an error message
  }
}

module.exports = deleteProduct;
