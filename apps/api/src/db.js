import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import pg from "pg";

dotenv.config({
  path: fileURLToPath(new URL("../../../.env", import.meta.url))
});

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não foi definida no arquivo .env.");
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.query("SELECT NOW()")
  .then((result) => {
    console.log("PostgreSQL conectado:", result.rows[0]);
  })
  .catch((error) => {
    console.error("Erro ao conectar ao PostgreSQL:", error);
  });
