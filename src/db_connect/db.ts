import mysql from "mysql2";

// PHPMyAdmin MySQL credentials
const db = mysql.createConnection({
  host: "localhost",     // usually localhost
  user: "root",          // তোমার MySQL username
  password: "",          // তোমার MySQL password
  database: "hp_db",     // database name
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("MySQL Connected Successfully ✅");
  }
});

export default db;
