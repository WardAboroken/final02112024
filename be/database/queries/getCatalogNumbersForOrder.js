// const getDbConnection = require("../db"); // Adjust the path to your DB connection file

// const getCatalogNumbersForOrder = async (orderNumber, userName) => {
//   const db = await getDbConnection();

//   // Step 1: Get all catalog numbers for the order from ORDERSCONTAINSPRODUCTS
//   const [catalogNumbersResult] = await db.query(
//     `SELECT catalogNumber 
//      FROM ORDERSCONTAINSPRODUCTS 
//      WHERE orderNumber = ?`,
//     [orderNumber]
//   );

//   if (!catalogNumbersResult || catalogNumbersResult.length === 0) {
//     return []; // No catalog numbers found
//   }

//   const catalogNumbers = catalogNumbersResult.map((row) => row.catalogNumber);

//   // Step 2: Filter catalog numbers that belong to the business owner from PRODUCTS
//   const [productsResult] = await db.query(
//     `SELECT catalogNumber 
//      FROM PRODUCTS 
//      WHERE catalogNumber IN (?) 
//      AND userName = ?`,
//     [catalogNumbers, userName]
//   );

//   if (!productsResult || productsResult.length === 0) {
//     return []; // No products found
//   }

//   // Step 3: Return the filtered catalog numbers
//   return productsResult.map((row) => row.catalogNumber);
// };

// module.exports = getCatalogNumbersForOrder;
