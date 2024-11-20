// be/databas/db.js
const mysql = require("mysql2/promise");

// ! the following  creates and uses one database connection for all queries. This single connection is established the first time getDbConnection is called and is then reused for subsequent database operations across your application

// ! with a single connection multiple queries will be executed sequentially

const dbConfig = {
  host: "127.0.0.1", // Localhost IP
  user: "root", // Username for MySQL
  password: "", // Password for MySQL (empty if no password)
  database: "final_project", // Your database name
  port: 3308, // Custom port since you're using 3308
};

let connection;

async function getDbConnection() {
  // a function that connect us with the DB
  if (!connection) {
    connection = await mysql.createConnection(dbConfig);
  }

  return connection;
}

module.exports = getDbConnection;
