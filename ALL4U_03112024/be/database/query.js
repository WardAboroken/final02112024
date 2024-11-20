// be/databas/query.js
const getDbConnection = require("./db");

async function doQuery(sql, params = []) {
  // a function that executes a SQL query against a database.
  try {
    const db = await getDbConnection();
    const result = await db.query(sql, params);
    console.log("Query executed successfully:", sql, params); // Log successful query execution
    return result[0];
  } catch (error) {
    console.error("Error executing query:", error.message); // Log error message
    throw error; // Rethrow the error to propagate it
  }
}

module.exports = doQuery;
