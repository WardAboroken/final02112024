// const getDbConnection = require("../db"); // Ensure correct path to your db connection module

// const getCompletedOrders = async (userName) => {
//   const db = await getDbConnection();

//   const query = `
//     SELECT 
//       o.orderNumber, 
//       SUM(p.price * ocp.productQuantity) AS totalCost, 
//       GROUP_CONCAT(p.catalogNumber) AS catalogNumbers 
//     FROM orderscontainsproducts ocp 
//     JOIN orders o ON ocp.orderNumber = o.orderNumber 
//     JOIN products p ON ocp.catalogNumber = p.catalogNumber 
//     WHERE p.userName = ? AND ocp.orderStatus = 'Been Provided' 
//     GROUP BY o.orderNumber 
//     ORDER BY o.orderDate DESC
//   `;

//   const [completedOrdersResult] = await db.query(query, [userName]);
//   return completedOrdersResult;
// };

// module.exports = getCompletedOrders;
