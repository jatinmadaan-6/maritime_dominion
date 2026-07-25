const mysql = require("mysql2/promise");

const pool = mysql.createPool({
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
});

module.exports = pool;
