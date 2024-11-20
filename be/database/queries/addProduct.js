const doQuery = require("../query");

/**
 * A shop function that adds a new product to the products table if the product does not exist already and returns success if succeeded; otherwise, returns an error.
 * @param {*} product
 * @returns {Object} success or error message
 */
async function addProduct(product) {
  // Destructure product properties, ensuring all variables are provided correctly
  const {
    catalogNumber,
    productName,
    amount,
    size,
    color,
    price,
    categoryNumber,
    userName,
    picturePath,
    description,
  } = product;

  try {
    // Validate input data
    if (
      !catalogNumber ||
      !productName ||
      !amount ||
      !price ||
      !categoryNumber ||
      !userName
    ) {
      return { error: "All required fields must be provided." };
    }

    // Check if the categoryNumber exists
    const categoryExists = await doQuery(
      `SELECT * FROM categories WHERE categoryNumber = ?`,
      [categoryNumber]
    );

    if (categoryExists.length === 0) {
      return { error: "Invalid category number. The category does not exist." };
    }

    // Check if the product already exists
    const existingProduct = await doQuery(
      `SELECT * FROM products WHERE catalogNumber = ?`,
      [catalogNumber]
    );

    if (existingProduct.length > 0) {
      return {
        error:
          "Product with this catalog number already exists in the database.",
      };
    }

    // Insert the product into the database
    const insertSql = `
      INSERT INTO products (catalogNumber, productName, amount, size, color, price, categoryNumber, userName, picturePath, description) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      catalogNumber,
      productName,
      amount,
      size,
      color,
      price,
      categoryNumber,
      userName,
      picturePath,
      description,
    ];

    const result = await doQuery(insertSql, params);

    // Log the result for debugging (optional)
    console.log("Insert result:", result);

    return { success: "New product has been added to the database." }; // Return a success message
  } catch (error) {
    // Handle specific errors like duplicate entry
    if (error.code === "ER_DUP_ENTRY") {
      return {
        error:
          "A product with this catalog number already exists. Duplicate entries are not allowed.",
      };
    }

    // Log the error for debugging
    console.error("Error adding product:", error);

    // Return a more specific error message
    return {
      error:
        "An error occurred while adding the product to the database. Please try again.",
    };
  }
}

module.exports = addProduct;