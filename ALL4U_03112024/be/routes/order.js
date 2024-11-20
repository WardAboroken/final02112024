const express = require("express");
const router = express.Router();
const getDbConnection = require("../database/db"); // Import the getDbConnection function correctly
const addOrder = require("../database/queries/addOrder"); // Import the addOrder function
const { client } = require("../utils/paypal"); // Import PayPal client
const paypal = require("@paypal/checkout-server-sdk"); // Import PayPal SDK
const doQuery = require("../database/query"); // Ensure this is the correct import for your query function
const updateOrderStatus = require("./../database/queries/updateOrderStatusInDB");

// Function to get PayPal emails for products
async function getPaypalEmailForProducts(products) {
  const db = await getDbConnection();
  const catalogNumbers = products.map((product) => product.catalogNumber);
  const [results] = await db.query(
    `SELECT DISTINCT p.catalogNumber, u.paypalEmail
     FROM PRODUCTS p
     JOIN users u ON p.userName = u.userName
     WHERE p.catalogNumber IN (?)`,
    [catalogNumbers]
  );
  console.log("resultsssssssssssssssssssssssss", results);
  const emailMap = results.reduce((map, row) => {
    map[row.catalogNumber] = row.paypalEmail;
    return map;
  }, {});

  return emailMap;
}

// Route to create PayPal orders for multiple shops
router.post("/createOrders", async (req, res) => {
  const { items, shippingAddress } = req.body; // Array of cart items and shipping address

  try {
    // Fetch the PayPal email for each product
    const emailMap = await getPaypalEmailForProducts(items);

    // Group items by shop (paypalEmail)
    const itemsGroupedByShop = items.reduce((groupedItems, item) => {
      const paypalEmail = emailMap[item.catalogNumber]; // Get the PayPal email for each item
      if (!groupedItems[paypalEmail]) {
        groupedItems[paypalEmail] = [];
      }
      groupedItems[paypalEmail].push(item);
      return groupedItems;
    }, {});

    const orders = {}; // Store order IDs for each shop

    for (const [paypalEmail, shopItems] of Object.entries(itemsGroupedByShop)) {
      const totalAmount = shopItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer("return=representation");
      request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: totalAmount.toFixed(2),
            },
            payee: {
              email_address: paypalEmail, // Use the fetched PayPal email
            },
          },
        ],
      });

      const order = await client.execute(request);
      orders[paypalEmail] = order.result.id; // Store order ID for this shop
    }

    res.status(201).json({ success: true, orders });
  } catch (error) {
    console.error("Error creating PayPal orders:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating PayPal orders.",
    });
  }
});

// Capture PayPal Orders for Multiple Shops
router.post("/captureOrders", async (req, res) => {
  const { orderIds, shippingAddress } = req.body; // Object with order IDs to capture and shipping address
  const captureResults = {};

  try {
    for (const [paypalEmail, orderId] of Object.entries(orderIds)) {
      const request = new paypal.orders.OrdersCaptureRequest(orderId);
      request.requestBody({});

      const capture = await client.execute(request);
      captureResults[paypalEmail] = capture.result; // Store capture result for this shop

      // After successful payment capture, add the order to the database
      const shopItems = capture.result.purchase_units[0].reference_id; // Assuming you pass necessary cartItems and userName in the request
      await finalizeOrderForShop(userName, shippingAddress, shopItems);
    }

    res.status(200).json({ success: true, captures: captureResults });
  } catch (error) {
    console.error("Error capturing PayPal orders:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while capturing PayPal orders.",
    });
  }
});

// Endpoint to get completed orders for a specific business owner
router.get("/get-completed-orders/:userName", async (req, res) => {
  const { userName } = req.params;

  try {
    const db = await getDbConnection(); // Get the database connection

    // SQL query to fetch completed orders with orderStatus = 'DONE'
    const [completedOrdersResult] = await db.query(
      `SELECT 
        o.orderNumber, 
        SUM(p.price * ocp.productQuantity) AS totalCost, 
        GROUP_CONCAT(p.catalogNumber) AS catalogNumbers 
       FROM orderscontainsproducts ocp 
       JOIN orders o ON ocp.orderNumber = o.orderNumber 
       JOIN products p ON ocp.catalogNumber = p.catalogNumber 
       WHERE p.userName = ? AND ocp.orderStatus = 'Been Provided' 
       GROUP BY o.orderNumber 
       ORDER BY o.orderDate DESC`,
      [userName]
    );

    if (!completedOrdersResult || completedOrdersResult.length === 0) {
      return res.status(404).json({
        message: "No completed orders found for this business owner.",
      });
    }

    res.json(completedOrdersResult);
  } catch (error) {
    console.error("Error fetching completed orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to get catalog numbers for a specific order and business owner
router.get("/get-catalog-numbers/:orderNumber/:userName", async (req, res) => {
  const { orderNumber, userName } = req.params;

  try {
    console.log(
      "Fetching catalog numbers for order:",
      orderNumber,
      "and user:",
      userName
    );

    const db = await getDbConnection(); // Get the database connection

    // Step 1: Get all catalog numbers for the order from ORDERSCONTAINSPRODUCTS
    const [catalogNumbersResult] = await db.query(
      `SELECT catalogNumber 
       FROM ORDERSCONTAINSPRODUCTS 
       WHERE orderNumber = ?`,
      [orderNumber]
    );

    console.log("Catalog numbers result:", catalogNumbersResult);

    if (!catalogNumbersResult || catalogNumbersResult.length === 0) {
      console.log("No catalog numbers found for this order.");
      return res.json([]); // No catalog numbers found for this order
    }

    const catalogNumbers = catalogNumbersResult.map((row) => row.catalogNumber);

    // Step 2: Filter catalog numbers that belong to the business owner from PRODUCTS
    const [productsResult] = await db.query(
      `SELECT catalogNumber 
       FROM PRODUCTS 
       WHERE catalogNumber IN (?) 
       AND userName = ?`,
      [catalogNumbers, userName]
    );

    console.log("Filtered catalog numbers result:", productsResult);

    if (!productsResult) {
      console.log("No products found for the given catalog numbers and user.");
      return res.json([]); // No products found
    }

    const filteredCatalogNumbers = productsResult.map(
      (row) => row.catalogNumber
    );

    // Step 3: Return the filtered catalog numbers
    res.json(filteredCatalogNumbers);
  } catch (error) {
    console.error("Error fetching catalog numbers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get out-of-stock products for a specific business owner
router.get("/get-out-of-stock-products/:userName", async (req, res) => {
  const { userName } = req.params;
  console.log(`
    Received request for out-of-stock products for user: ${userName}`
  );
  try {
    const outOfStockQuery = `
      SELECT catalogNumber, productName, picturePath, amount
      FROM products
      WHERE userName = ? AND amount = 0;
    `;

    const outOfStockProducts = await doQuery(outOfStockQuery, [userName]);
    console.log("Out of stock products.length: ", outOfStockProducts.length); // Log the result

    if (outOfStockProducts.length === 0) {
      return res.json({ message: "No out-of-stock products found." });
    }

    res.json(outOfStockProducts);
  } catch (error) {
    console.error("Error fetching out-of-stock products:", error);
    res.status(500).json({ message: "Error fetching out-of-stock products." });
  }
});

// Route to get all orders for a specific business owner (new orders)
router.get("/get-business-new-orders/:userName", async (req, res) => {
  const { userName } = req.params;

  try {
    const ordersQuery = `
      SELECT o.orderNumber, o.orderDate AS date, ocp.orderStatus AS status, 
             SUM(p.price * ocp.productQuantity) AS totalCost
      FROM orderscontainsproducts ocp
      JOIN orders o ON ocp.orderNumber = o.orderNumber
      JOIN products p ON ocp.catalogNumber = p.catalogNumber
      WHERE p.userName = ? AND ocp.orderStatus = 'Received'
      GROUP BY o.orderNumber, ocp.orderStatus, o.orderDate
      ORDER BY o.orderDate DESC;
    `;

    const orders = await doQuery(ordersQuery, [userName]);
    console.log(`Received orders to  ${userName} >> `, orders);
    if (orders.length === 0) {
      return res.status(404).json({
        message: "No new orders found for this business owner.",
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

router.get("/get-business-orders/:userName", async (req, res) => {
  const { userName } = req.params;

  try {
    const ordersQuery = `
      SELECT
        o.orderNumber,
        o.orderDate AS date,
        ocp.orderStatus AS status,
        SUM(p.price * ocp.productQuantity) AS totalCost,  -- Calculate the total cost
        GROUP_CONCAT(p.catalogNumber) AS catalogNumbers  -- Concatenate catalog numbers
      FROM
        orderscontainsproducts ocp
      JOIN
        orders o ON ocp.orderNumber = o.orderNumber
      JOIN
        products p ON ocp.catalogNumber = p.catalogNumber
      WHERE
        p.userName = ?
      GROUP BY
        o.orderNumber, ocp.orderStatus, o.orderDate
      ORDER BY
        o.orderDate DESC;
    `;

    const orders = await doQuery(ordersQuery, [userName]);

    if (orders.length === 0) {
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



// פונקציה לעדכון סטטוס ההזמנה עבור מוצר ספציפי
// Route to update order status for a specific product within an order

router.get("/get-been-provided-orders/:userName", async (req, res) => {
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


router.put("/update-order-status/:orderNumber", async (req, res) => {
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

// Endpoint to get detailed product information for a specific order and user
router.post("/get-order-details", async (req, res) => {
  const { orderNumber } = req.body; // Get orderNumber and userName from the request body

  try {
    const db = await getDbConnection();

    // SQL query to fetch the product details for the given order
    const [orderDetailsResult] = await db.query(
      `SELECT  
  ocp.catalogNumber, 
  p.productName, 
  ocp.productQuantity AS amount, 
  p.size, 
  p.color, 
  p.price,
  o.userName,
  u.name,         -- Fetch the name from users table
  u.phoneNumber,        -- Fetch the phone from users table
  u.address       -- Fetch the address from users table
FROM 
  orderscontainsproducts ocp
JOIN 
  products p ON ocp.catalogNumber = p.catalogNumber 
JOIN 
  orders o ON ocp.orderNumber = o.orderNumber
JOIN 
  users u ON o.userName = u.userName  -- Join with users table based on userName from orders
WHERE 
  ocp.orderNumber = ?;
`, // Ensure products belong to the logged-in user (business owner)
      [orderNumber]
    );

    console.log("Order details >>", orderDetailsResult);
    if (!orderDetailsResult || orderDetailsResult.length === 0) {
      return res
        .status(404)
        .json({ message: "No details found for this order." });
    }

    // Send both customer userName and product details in the response
    res.json({
      orderDetails: orderDetailsResult,
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// Define handleError function
const handleError = (res, error, message = "An error occurred") => {
  console.error(message, error);
  res.status(500).json({ error: message });
};


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
      const deleteCartItemResponse = await fetch(`
        http://localhost:5000/cart/${encodeURIComponent(item.catalogNumber)}`,
        { method: "DELETE" }
      );

      if (!deleteCartItemResponse.ok) {
        console.error(`
          Failed to delete cart item with catalogNumber: ${item.catalogNumber}`
        );
      } else {
        console.log(`
          Deleted item with catalogNumber ${item.catalogNumber} from the cart.`
        );
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

// Route to get all orders for a specific user
router.get('/getUserOrders/:userName', async (req, res) => {
  const { userName } = req.params;

  console.log("Fetching orders for username:", userName);

  try {
    // Get the database connection
    const db = await getDbConnection();

    // Query the database to find orders by userName
    const [orders] = await db.query(
      'SELECT orderNumber, shippingAddress, orderDate FROM orders WHERE userName = ?',
      [userName]
    );

    // Check if any orders are found
    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    // Return the list of orders
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch user orders' });
  }
});



// Route to get order details
router.get("/getOrderDetails/:orderNumber", async (req, res) => {
  const { orderNumber } = req.params;

  console.log("im in detailssssss", orderNumber);

  try {
    const db = await getDbConnection(); // Get the database connection
    const query = `
     SELECT 
        p.productName, 
        ocp.productQuantity, 
        ocp.orderStatus, 
        p.price, 
        p.picturePath,  -- Fetch picturePath
        p.catalogNumber
      FROM 
        orderscontainsproducts ocp 
      JOIN 
        products p ON ocp.catalogNumber = p.catalogNumber
      WHERE 
        ocp.orderNumber = ?
    `;

    const [orderDetails] = await db.query(query, [orderNumber]);
    if (orderDetails.length === 0) {
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