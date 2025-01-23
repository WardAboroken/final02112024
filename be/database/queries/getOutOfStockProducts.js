const doQuery = require("../db"); // Adjust the path to your DB connection file

const getOutOfStockProducts = async (userName) => {
  const db = await doQuery();

  const query = `
    SELECT catalogNumber, productName, picturePath, amount
    FROM products
    WHERE userName = ? AND amount = 0;
  `;

  const [outOfStockProducts] = await db.query(query, [userName]);

  return outOfStockProducts; // Returns the out-of-stock products or an empty array
};

module.exports = getOutOfStockProducts;
