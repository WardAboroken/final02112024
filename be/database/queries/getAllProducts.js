const doQuery = require("../query");

/**
 * A shop function which gets all products from products table
 * @returns result of query
 */
async function getAllProducts() {
  const sql = `SELECT 
    p.catalogNumber,
    p.productName,
    p.amount,
    p.size,
    p.color,
    p.price,
    p.picturePath,
    p.categoryNumber,
    p.userName,
    p.description,
    p.status
  FROM 
    products p
  JOIN 
    businessowner b ON p.userName = b.userName`;

  const result = await doQuery(sql);
  return result;
}

module.exports = getAllProducts;
