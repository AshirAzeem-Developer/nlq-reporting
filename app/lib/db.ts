import mysql from "mysql2/promise";

// Option 1: Using individual env variables (recommended)
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "dashboardDB",
  port: parseInt(process.env.DB_PORT || "3306"),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Option 2: Using DATABASE_URL (if you prefer connection string)
// const pool = mysql.createPool(process.env.DATABASE_URL!);

export async function query(sql: string, params?: any[]) {
  try {
    const start = Date.now();
    const [rows, fields] = await pool.execute(sql, params);
    const duration = Date.now() - start;

    console.log("✅ Query executed:", {
      duration: `${duration}ms`,
      rowCount: Array.isArray(rows) ? rows.length : 0,
    });

    return {
      rows: rows as any[],
      rowCount: Array.isArray(rows) ? rows.length : 0,
      fields:
        Array.isArray(rows) && rows.length > 0
          ? Object.keys(rows[0]).map((name) => ({ name }))
          : [],
    };
  } catch (error: any) {
    console.error("❌ Query failed:", error.message);
    throw error;
  }
}

export default pool;
