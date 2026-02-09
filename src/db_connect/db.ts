import mysql from "mysql2";

// PHPMyAdmin MySQL credentials
const db = mysql.createConnection({
  host: "localhost",     // usually localhost
  user: "root",          // Your MySQL username
  password: "",          // Your MySQL password
  database: "hp_db",     // database name
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("MySQL Connected Successfully ✅");
    
    // Fix password column length for bcrypt hashes (60 chars needed)
    db.query("ALTER TABLE login MODIFY COLUMN password VARCHAR(255) NOT NULL", (alterErr) => {
      if (alterErr) {
        // Ignore error if column already correct
        console.log("Password column check complete.");
      } else {
        console.log("Password column updated to VARCHAR(255) ✅");
      }
    });
  }
});

export default db;
