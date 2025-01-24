const doQuery = require("../db"); // Adjust the path to your DB connection file

const getBeenProvidedOrders = async (userName, startDate, endDate) => {
  const db = await doQuery();

  // Base query
  let query = `
    SELECT o.orderNumber, DATE(o.orderDate) AS date, ocp.orderStatus AS status, 
           SUM(p.price * ocp.productQuantity) AS totalCost
    FROM orderscontainsproducts ocp
    JOIN orders o ON ocp.orderNumber = o.orderNumber
    JOIN products p ON ocp.catalogNumber = p.catalogNumber
    WHERE p.userName = ? AND ocp.orderStatus = 'Been Provided'
  `;

  const queryParams = [userName];

  // Apply optional date filters
  if (startDate) {
    query += ` AND DATE(o.orderDate) >= ?`;
    queryParams.push(startDate);
  }
  if (endDate) {
    query += ` AND DATE(o.orderDate) <= ?`;
    queryParams.push(endDate);
  }

  // Add grouping and ordering
  query += `
    GROUP BY o.orderNumber, ocp.orderStatus, DATE(o.orderDate)
    ORDER BY DATE(o.orderDate) DESC;
  `;

  const orders = await db.query(query, queryParams);
  return orders; // Returns the orders or an empty array
};

module.exports = getBeenProvidedOrders;
