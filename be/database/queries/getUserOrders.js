const getDbConnection = require("../db"); // Adjust the path to your DB connection file

const getUserOrders = async (userName) => {
  const db = await getDbConnection();

  const query = `
    SELECT 
      orderNumber, 
      shippingAddress, 
      orderDate 
    FROM 
      orders 
    WHERE 
      userName = ?;
  `;

  const [orders] = await db.query(query, [userName]);
  return orders; // Returns the user orders or an empty array
};

module.exports = getUserOrders;
