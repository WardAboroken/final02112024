const doQuery = require("../db"); // Adjust the path to your DB connection file

const getBusinessNewOrders = async (userName) => {
  const db = await doQuery();

  const query = `
    SELECT o.orderNumber, o.orderDate AS date, ocp.orderStatus AS status, 
           SUM(p.price * ocp.productQuantity) AS totalCost
    FROM orderscontainsproducts ocp
    JOIN orders o ON ocp.orderNumber = o.orderNumber
    JOIN products p ON ocp.catalogNumber = p.catalogNumber
    WHERE p.userName = ? AND ocp.orderStatus = 'Received'
    GROUP BY o.orderNumber, ocp.orderStatus, o.orderDate
    ORDER BY o.orderDate DESC;
  `;

  const [orders] = await db.query(query, [userName]);

  return orders; // Returns the new orders or an empty array
};

module.exports = getBusinessNewOrders;
