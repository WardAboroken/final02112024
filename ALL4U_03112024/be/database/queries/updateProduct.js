const doQuery = require("../query");

/**
 * Updates a product in the products table based on the catalogNumber.
 * Only updates the fields that are not null or undefined.
 * @param {string} catalogNumber - The catalog number of the product to update.
 * @param {object} updatedProductData - The new data to update the product with.
 * @returns {object} - Returns an object containing the updated product or an error message.
 */
async function updateProduct(catalogNumber, updatedProductData) {
  const {
    productName,
    description,
    color,
    size,
    amount,
    price,
    categoryNumber, // Ensure categoryNumber is handled correctly
    picturePath,
    status,
  } = updatedProductData;

  try {
    // Retrieve the current picturePath from the database
    const currentProduct = await doQuery(
      `SELECT picturePath FROM products WHERE catalogNumber = ?`,
      [catalogNumber]
    );

    if (currentProduct.length === 0) {
      return {
        success: false,
        message: "No product found with the provided catalog number.",
      };
    }

    const currentPicturePath = currentProduct[0].picturePath;

    // If picturePath is not provided and the current picturePath is not null, keep the current picturePath
    let finalPicturePath;
    if (picturePath !== undefined) {
      finalPicturePath = picturePath;
    } else if (currentPicturePath !== null) {
      finalPicturePath = currentPicturePath;
    } else {
      finalPicturePath = null; // If current picturePath is null, keep it as null
    }

    // Construct the update query dynamically
    let updateFields = [];
    let params = [];

    if (productName !== undefined) {
      updateFields.push("productName = ?");
      params.push(productName);
    }
    if (description !== undefined) {
      updateFields.push("description = ?");
      params.push(description);
    }
    if (color !== undefined) {
      updateFields.push("color = ?");
      params.push(color);
    }
    if (size !== undefined) {
      updateFields.push("size = ?");
      params.push(size);
    }
    if (amount !== undefined) {
      updateFields.push("amount = ?");
      params.push(amount);
    }
    if (price !== undefined) {
      updateFields.push("price = ?");
      params.push(price);
    }
    if (status !== undefined) {
      updateFields.push("status = ?");
      params.push(status);
    }
    if (categoryNumber !== undefined) {
      // Ensure `categoryNumber` is included in the update
      updateFields.push("categoryNumber = ?");
      params.push(parseInt(categoryNumber, 10)); // Convert to integer before pushing
    }
    if (finalPicturePath !== undefined) {
      updateFields.push("picturePath = ?");
      params.push(finalPicturePath);
    }

    // If there are no fields to update, return an error
    if (updateFields.length === 0) {
      return {
        success: false,
        message: "No fields to update.",
      };
    }

    // Construct the SQL query
    const updateSql = `
      UPDATE products
      SET ${updateFields.join(", ")}
      WHERE catalogNumber = ?
    `;

    params.push(catalogNumber); // Add catalogNumber as the last parameter

    const result = await doQuery(updateSql, params);

    if (result.affectedRows > 0) {
      // Fetch the updated product
      const updatedProduct = await doQuery(
        `SELECT * FROM products WHERE catalogNumber = ?`,
        [catalogNumber]
      );
      return { success: true, product: updatedProduct[0] };
    } else {
      return {
        success: false,
        message: "No product found with the provided catalog number.",
      };
    }
  } catch (error) {
    console.error("Error updating product in the database:", error);
    return { success: false, error: "Error updating product in the database." };
  }
}

module.exports = updateProduct;
