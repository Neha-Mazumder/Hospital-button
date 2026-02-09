const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hp_db",
});

db.connect((err) => {
  if (err) {
    console.error("Connection failed:", err);
    return;
  }
  console.log("Connected. Modifying table...");

  db.query("ALTER TABLE login MODIFY password VARCHAR(255) NOT NULL", (err, result) => {
    if (err) {
      console.error("Error:", err);
    } else {
      console.log("Success! Password column expanded.");
    }
    db.end();
  });
});
