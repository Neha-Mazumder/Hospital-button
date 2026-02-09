// Script to fix database schema
import db from "./src/db_connect/db.ts";

console.log("Fixing database schema...");

setTimeout(() => {
    const sql = "ALTER TABLE login MODIFY password VARCHAR(255) NOT NULL";
    
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error updating table structure:", err);
      } else {
        console.log("Successfully updated 'login' table password column to VARCHAR(255) ✅");
      }
      
      db.query("SHOW COLUMNS FROM login LIKE 'password'", (err, result) => {
          if (err) console.error(err);
          else console.log("Current column definition:", result);
          process.exit();
      });
    });
}, 1000);
