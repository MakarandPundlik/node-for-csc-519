import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();

const main = async () => {
  // Use relative path so DB is created in project folder
  const db = await open({
    filename: "./mydb.sqlite",
    driver: sqlite3.Database,
  });

  // Create employee table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS employee (
      id INTEGER PRIMARY KEY,
      name TEXT,
      role TEXT,
      salary REAL
    )
  `);

  // Insert sample records
  const employees = [
    { id: 1, name: "Alice", role: "Engineer", salary: 90000 },
    { id: 2, name: "Bob", role: "Manager", salary: 120000 },
    { id: 3, name: "Charlie", role: "Analyst", salary: 70000 },
  ];

  for (const emp of employees) {
    await db.run(
      "INSERT OR IGNORE INTO employee (id, name, role, salary) VALUES (?, ?, ?, ?)",
      emp.id,
      emp.name,
      emp.role,
      emp.salary
    );
  }

  // Serve employee records
  app.get("/", async (req, res) => {
    try {
      const rows = await db.all("SELECT * FROM employee");
      let html = "<h1>Hello CSC-519 World!</h1><h2>Employee Records:</h2><ul>";
      rows.forEach((row) => {
        html += `<li>${row.id}: ${row.name}, ${row.role}, $${row.salary}</li>`;
      });
      html += "</ul>";
      res.send(html);
    } catch (err) {
      res.status(500).send("DB Error: " + err.message);
    }
  });

  app.listen(80, () => console.log("Node.js app running on port 80"));
};

main();
