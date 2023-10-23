import "dotenv/config";
import mysql from "mysql2/promise";

// Conectar a base de datos
export const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "mydb",
  namedPlaceholders: true,
});

console.log("Conectado a base de datos");