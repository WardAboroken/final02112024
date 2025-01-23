// be/database/queries/getPaypalEmailForProducts.js
// Import your database query function (doQuery) here
const doQuery = require("../query");

// Function to get PayPal emails for products
async function getPaypalEmailForProducts(products) {
  const db = await getDbConnection();
  const catalogNumbers = products.map((product) => product.catalogNumber);
  const [results] = await doQuery(
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
// Export the function to make it accessible to other parts of your application
module.exports = getPaypalEmailForProducts;
