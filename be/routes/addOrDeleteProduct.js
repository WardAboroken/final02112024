// This code defines a route handler for adding a new product to your application.
const express = require("express");
const addProduct = require("../../database/queries/addProduct");
const deleteProduct = require("../../database/queries/deleteProduct");
const router = express.Router();

router.post("/addProduct", async (req, res, next) => {
  // This function defines a route handler for adding a new product to your application. When a POST request is sent to "/addProduct", it attempts to add the product data received in the request body to the database. Depending on whether the addition is successful or not, it redirects the client to "/mainPageWorkers.html".
  try {
    console.log("Adding new user:", req.body);
    const product = req.body;
    const result = await addProduct(product);
    // Sending a response to the client
    
    if (result.success) {
      console.log("return");
      res.status(200).json({ message: "Adding Success" }); // Sending success message if addition is successful
    } else {
      res.status(400).json({ message: "Product is exist." }); // Sending error message if product already exists
    }
  } catch (error) {
    res.redirect("/404.html");
  }
});




router.post("/deleteProduct", async (req, res, next) => {
  // This function handles POST requests to delete a product from your application. It receives product data in the request body, attempts to delete the corresponding product from the database, and redirects the client to "/mainPageWorkers.html" regardless of whether the deletion is successful or not. If any errors occur during the process, it also redirects the client to "/mainPageWorkers.html".
  try {
    console.log(req.body)
    console.log("deleteProduct: ", req.body);
    const product = req.body;
    const result = await deleteProduct(product);

    // Sending a response to the client
    if (result.success) {
      res.status(200).json({ message: "delete Product success!" }); // Sending success message if deletion is successful
    } else {
      res.status(400).json({ message: "Product not exist." }); // Sending error message if product does not exist
    }
  } catch (error) {
    // Redirecting the client to "/mainPageWorkers.html" in case of any errors
    res.redirect("/404.html");
  }
});

module.exports = router;
