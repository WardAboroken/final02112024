const express = require("express");
const router = express.Router();

// Mock Database (Replace with a real database in production)
let cartItems = []; // Initialize cartItems array

// Route to fetch cart items
router.get("/", (req, res) => {
  res.json(cartItems); // Respond with the current cart items
});



// Route to add a new item to the cart
router.post("/", (req, res) => {
  const {
    catalogNumber,
    productName,
    price,
    amount,
    quantity,
    picturePath,
    color,
    size,
    userName,
  } = req.body;

  if (!catalogNumber || !productName || !price || !amount || !quantity) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if the quantity does not exceed the product's available amount
  if (quantity > amount) {
    return res
      .status(400)
      .json({ message: "Quantity cannot exceed available amount" });
  }

  const existingItem = cartItems.find(
    (item) =>
      item.catalogNumber === catalogNumber &&
      item.color === color &&
      item.size === size
  );

  if (existingItem) {
    // Ensure that the total quantity does not exceed the available amount
    if (existingItem.quantity + quantity > existingItem.amount) {
      return res
        .status(400)
        .json({ message: "Total quantity cannot exceed available amount" });
    }
    existingItem.quantity += quantity; // Update the quantity if the item already exists with the same color and size
  } else {
    cartItems.push({
      catalogNumber,
      productName,
      price,
      amount, // Product amount available in stock
      quantity, // Quantity user wants to add to the cart
      picturePath,
      color,
      size,
      userName, // Include userName when adding the item
    });
  }

  res.status(201).json(cartItems);
});

// Route to update the quantity of an item in the cart
router.put("/:itemCatalogNumber", (req, res) => {
  const { itemCatalogNumber } = req.params; // This will be a string
  const { quantity } = req.body;

  if (!quantity || isNaN(quantity)) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  const item = cartItems.find(
    (item) => item.catalogNumber === parseInt(itemCatalogNumber) // Ensure correct type comparison
  );

  if (!item) {
    console.error(`Item not found for catalogNumber: ${itemCatalogNumber}`); // Debug log for missing item
    return res.status(404).json({ message: "Item not found" });
  }

  // Ensure that the updated quantity does not exceed the available amount
  if (quantity > item.amount) {
    return res
      .status(400)
      .json({ message: "Quantity cannot exceed available amount" });
  }

  item.quantity = quantity; // Update the item quantity
  res.status(200).json(cartItems); // Respond with the updated cart
});

// Route to remove an item from the cart
router.delete("/:itemCatalogNumber", (req, res) => {
  const { itemCatalogNumber } = req.params;

  const itemIndex = cartItems.findIndex(
    (item) => item.catalogNumber === parseInt(itemCatalogNumber) // Ensure correct type comparison
  );

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  cartItems.splice(itemIndex, 1); // Remove the item from the array
  res.status(200).json(cartItems); // Respond with the updated cart
});

module.exports = router;
