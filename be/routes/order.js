const express = require("express");
const router = express.Router();
const getDbConnection = require("../database/db"); // Import the getDbConnection function correctly
const addOrder = require("../database/queries/addOrder"); // Import the addOrder function
const { client } = require("../utils/paypal"); // Import PayPal client
const paypal = require("@paypal/checkout-server-sdk"); // Import PayPal SDK
const doQuery = require("../database/query"); // Ensure this is the correct import for your query function
const updateOrderStatus = require("./../database/queries/updateOrderStatusInDB");
const getPaypalEmailForProducts = require("../database/queries/getPaypalEmailForProducts");
const getOutOfStockProducts = require("../database/queries/getOutOfStockProducts");
const getBusinessNewOrders = require("../database/queries/getBusinessNewOrders");
const getBusinessOrders = require("../database/queries/getBusinessOrders");
const getBeenProvidedOrders = require("../database/queries/getBeenProvidedOrders");
const getOrderDetails = require("../database/queries/getOrderDetails");
const getUserOrders = require("../database/queries/getUserOrders");
const getOrderDetailsByOrderNumber = require("../database/queries/getOrderDetailsByOrderNumber");






// Route to get out-of-stock products for a specific business owner
// doneeeeeeeeeee
router.get("/getOutOfStockProducts/:userName", async (req, res) => {
  const { userName } = req.params;

  console.log(
    `Received request for out-of-stock products for user: ${userName}`
  );

  try {
    const outOfStockProducts = await getOutOfStockProducts(userName);

    if (!outOfStockProducts || outOfStockProducts.length === 0) {
      return res.json({ message: "No out-of-stock products found." });
    }

    res.json(outOfStockProducts);
  } catch (error) {
    console.error("Error fetching out-of-stock products:", error);
    res.status(500).json({ message: "Error fetching out-of-stock products." });
  }
});

// Route to get all orders for a specific business owner (new orders)
// doneeeeeeeeeeeeeeeee
router.get("/getBusinessNewOrders/:userName", async (req, res) => {
  const { userName } = req.params;

  try {
    const orders = await getBusinessNewOrders(userName);

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "No new orders found for this business owner.",
      });
    }

    console.log(`Received orders for ${userName} >> `, orders);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders for business owner:", error);
    res
      .status(500)
      .json({ message: "Error fetching orders for business owner." });
  }
});

// doneeeeeeeeeeeeeeeeeeeeeeee
router.get("/getBusinessOrders/:userName", async (req, res) => {
  const { userName } = req.params;

  try {
    const orders = await getBusinessOrders(userName);

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "No orders found for this business owner.",
      });
    }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders for business owner:", error);
    res
      .status(500)
      .json({ message: "Error fetching orders for business owner." });
  }
});

// doneeeeeeeeeeeeee
// router.get("/getBeenProvidedOrders/:userName", async (req, res) => {
//   const { userName } = req.params;
//   const { startDate, endDate } = req.query;

//   console.log("Received startDate:", startDate);
//   console.log("Received endDate:", endDate);

//   try {
//     const orders = await getBeenProvidedOrders(userName, startDate, endDate);

//     if (!orders) {
//       return res.status(404).json({
//         message:
//           "No 'Been Provided' orders found for this business owner within the given date range.",
//       });
//     }

//     console.log(
//       `Been Provided orders for ${userName} between ${startDate} and ${endDate} >> `,
//       orders
//     );

//     res.json(orders);
//   } catch (error) {
//     console.error("Error fetching 'Been Provided' orders:", error);
//     res.status(500).json({ message: "Error fetching 'Been Provided' orders." });
//   }
// });



router.get("/getBeenProvidedOrders/:userName", async (req, res) => {
  const { userName } = req.params;
  const { startDate, endDate } = req.query; // Receive startDate and endDate as query parameters
  console.log("Received startDate:", startDate);
  console.log("Received endDate:", endDate);

  try {
    // Base query
    let ordersQuery = `
  SELECT o.orderNumber, DATE(o.orderDate) AS date, ocp.orderStatus AS status, 
         SUM(p.price * ocp.productQuantity) AS totalCost
  FROM orderscontainsproducts ocp
  JOIN orders o ON ocp.orderNumber = o.orderNumber
  JOIN products p ON ocp.catalogNumber = p.catalogNumber
  WHERE p.userName = ? AND ocp.orderStatus = 'Been Provided'
`;

    const queryParams = [userName];
    console.log("Query Params:", queryParams);
    // Optional date range filter
    // Modify the WHERE clause to ignore the time component when filtering by date
    // Filter by date using the DATE() function in SQL to exclude orders before or after the date range
    if (startDate) {
      ordersQuery += ` AND DATE(o.orderDate) >= ?`;
      queryParams.push(startDate);
    }
    if (endDate) {
      ordersQuery += ` AND DATE(o.orderDate) <= ?`;
      queryParams.push(endDate);
    }

    // Add GROUP BY and ORDER BY clauses
    ordersQuery += `
  GROUP BY o.orderNumber, ocp.orderStatus, DATE(o.orderDate)
  ORDER BY DATE(o.orderDate) DESC;
`;

    // Run query with dynamic parameters
    const orders = await doQuery(ordersQuery, queryParams);
    console.log(
      `Been Provided orders to ${userName} between ${startDate} and ${endDate} >> `,
      orders
    );

    if (!orders) {
      return res.status(404).json({
        message:
          "No 'Been Provided' orders found for this business owner within the given date range.",
      });
    }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching 'Been Provided' orders:", error);
    res.status(500).json({ message: "Error fetching 'Been Provided' orders." });
  }
});









router.put("/updateOrderStatus/:orderNumber", async (req, res) => {
  const { orderNumber } = req.params;
  const { catalogNumbers, status } = req.body; // Get catalog numbers and status from the request body

  if (!status || !catalogNumbers || !catalogNumbers.length) {
    return res
      .status(400)
      .json({ message: "Status and catalog numbers are required" });
  }

  try {
    // Call the function to perform the update in the database
    const result = await updateOrderStatus(orderNumber, catalogNumbers, status);
    if (result.success) {
      res.status(200).json({ message: "Order status updated successfully" });
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

// doneeeeeeeeeeeeee ward
// Endpoint to get detailed product information for a specific order and user
router.post("/getOrderDetails", async (req, res) => {
  const { orderNumber } = req.body;

  try {
    const orderDetails = await getOrderDetails(orderNumber);

    if (!orderDetails || orderDetails.length === 0) {
      return res
        .status(404)
        .json({ message: "No details found for this order." });
    }

    console.log("Order details >>", orderDetails);

    res.json({ orderDetails });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// // Define handleError function
// const handleError = (res, error, message = "An error occurred") => {
//   console.error(message, error);
//   res.status(500).json({ error: message });
// };

// good
router.post("/addOrder", async (req, res) => {
  const { userName, shippingAddress, cartItems } = req.body;

  try {
    console.log("Received order data:", {
      userName,
      shippingAddress,
      cartItems,
    });

    // Step 1: Add the order to the database and update the product stock
    const result = await addOrder({ userName, shippingAddress, cartItems });

    if (result.error) {
      console.error("Error while adding the order:", result.error);
      return res.status(500).json({ success: false, message: result.error });
    }

    // Step 2: Delete each ordered item from the cart after successfully adding the order
    for (let item of cartItems) {
      const deleteCartItemResponse = await fetch(
        `
        http://localhost:5000/cart/${encodeURIComponent(item.catalogNumber)}`,
        { method: "DELETE" }
      );

      if (!deleteCartItemResponse.ok) {
        console.error(`
          Failed to delete cart item with catalogNumber: ${item.catalogNumber}`);
      } else {
        console.log(`
          Deleted item with catalogNumber ${item.catalogNumber} from the cart.`);
      }
    }

    // Step 3: Return a success response to the client
    res.status(201).json({ success: true, message: result.success });
  } catch (error) {
    console.error("Error while processing the order:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to process the order" });
  }
});

/// doneeeeeeeeee ward
// Route to get all orders for a specific user
router.get("/getUserOrders/:userName", async (req, res) => {
  const { userName } = req.params;

  console.log("Fetching orders for username:", userName);

  try {
    const orders = await getUserOrders(userName);

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    // Return the list of orders
    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
});

/// doneeeeeeeeee ward
// Route to get order details by order number
router.get("/getOrderDetailsByOrderNumber/:orderNumber", async (req, res) => {
  const { orderNumber } = req.params;

  console.log("Fetching details for order number:", orderNumber);

  try {
    const orderDetails = await getOrderDetailsByOrderNumber(orderNumber);

    if (!orderDetails || orderDetails.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this order." });
    }

    res.json(orderDetails);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Failed to fetch order details." });
  }
});

module.exports = router;
