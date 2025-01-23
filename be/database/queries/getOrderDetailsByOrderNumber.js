const getDbConnection = require("../db"); // Adjust the path to your DB connection file

const getOrderDetailsByOrderNumber = async (orderNumber) => {
  const db = await getDbConnection();

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
  return orderDetails; // Returns the order details or an empty array
};

module.exports = getOrderDetailsByOrderNumber;
