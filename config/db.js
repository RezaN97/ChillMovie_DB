const mysql = require("mysql2/promise")
const dotenv = require("dotenv")

dotenv.config()

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME
})

async function testDbConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Successfully connected to MySQL database!");
    connection.release();
  } catch (error) {
    console.error("Error connecting to MySQL database:", error.message);
    process.exit(1);
  }
}

testDbConnection();

module.exports = pool