const doQuery = require("../query");

/**
 * A shop function which adds a new order to the orders table and its products to the orderscontainsproducts table
 * @param {*} order
 * @returns success/error
 */
async function addOrder(order) {
  const { userName, shippingAddress, cartItems } = order;
  console.log("Received cart items:", cartItems);

  try {
    // Check if cartItems is not empty and all items have a valid catalogNumber
    if (!cartItems || cartItems.length === 0) {
      return { error: "Cart is empty or invalid items provided." };
    }
    // Validate cart items before inserting
    for (const item of cartItems) {
      const quantity = parseInt(item.quantity, 10); // Parse productQuantity as an integer

      if (!item.catalogNumber) {
        console.error("Error: Missing catalogNumber for item:", item);
        return { error: "Invalid item data: catalogNumber is required." };
      }

      if (isNaN(quantity) || quantity <= 0) {
        console.error("Error: Invalid quantity for item:", item);
        return {
          error: `Invalid productQuantity for item with catalogNumber: ${item.catalogNumber}`,
        };
      }

      item.quantity = quantity; // Ensure the productQuantity is updated as an integer
    }

    // Insert the order into the database
    const orderDate = new Date().toISOString().slice(0, 19).replace("T", " "); // Current date and time in MySQL format

    const insertOrderSql = `INSERT INTO orders (userName, shippingAddress, orderDate) VALUES (?, ?, ?)`;
    const orderParams = [userName, shippingAddress, orderDate];
    const result = await doQuery(insertOrderSql, orderParams);

    // Get the newly inserted order ID (orderNumber)
    const orderNumber = result.insertId; // Ensure this matches the auto-increment ID from your orders table
    console.log("Order inserted with orderNumber:", orderNumber);

    // Insert the order items into the orderscontainsproducts table
    const insertOrderItemsSql = `INSERT INTO orderscontainsproducts (catalogNumber, orderStatus,productQuantity,orderNumber ) VALUES (?, ?, ?, ?)`;

    for (const item of cartItems) {
      const { catalogNumber, quantity } = item;

      const orderItemParams = [
        item.catalogNumber,
        "Received",
        item.quantity, // Using item-specific productQuantity
        orderNumber
      ];
      await doQuery(insertOrderItemsSql, orderItemParams);
      console.log(
       ` Inserted item with catalogNumber ${catalogNumber} into orderscontainsproducts with orderNumber ${orderNumber}`
      );

      // Update the amount of the product in the products table
      const updateProductAmountSql = `UPDATE products SET amount = amount - ? WHERE catalogNumber = ?`;
      const updateProductParams = [item.quantity, item.catalogNumber]; // Reduce stock by the ordered productQuantity
      await doQuery(updateProductAmountSql, updateProductParams);
      console.log(
       ` Updated product with catalogNumber ${catalogNumber}, reducing amount by ${quantity}`
      );
    }

    console.log(
      "Order and all order items inserted successfully, product amounts updated"
    );

    return {
      success:` Order has been added to the database with orderNumber: ${orderNumber}`,
    }; // Return a success message with the new order ID
  } catch (error) {
    console.error("Error adding order:", error); // Log the error for debugging
    return { error: "Error adding order to the database" }; // Return an error message
  }
}

module.exports = addOrder;