const mysql = require("mysql2/promise");

const pool = mysql.createPool({
<<<<<<< HEAD
  host: process.env.HOST,
  port: process.env.PORT || 4000,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    minVersion: "TLSv1.2"
  }
=======
  host: process.env.DB_HOST || "localhost", user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "", database: process.env.DB_NAME || "maritime",
  waitForConnections: true, connectionLimit: 10, queueLimit: 0,
>>>>>>> master
});

module.exports = pool;
