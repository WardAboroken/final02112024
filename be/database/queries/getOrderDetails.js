const getDbConnection = require("../db"); // Adjust the path to your DB connection file

const getOrderDetails = async (orderNumber) => {
  const db = await getDbConnection();

  const query = `
    SELECT  
      ocp.catalogNumber, 
      p.productName, 
      ocp.productQuantity AS amount, 
      p.size, 
      p.color, 
      p.price,
      o.userName,
      u.name,         -- Fetch the name from users table
      u.phoneNumber,  -- Fetch the phone from users table
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
  `;

  const [orderDetails] = await db.query(query, [orderNumber]);
  return orderDetails; // Returns the order details or an empty array
};

module.exports = getOrderDetails;
