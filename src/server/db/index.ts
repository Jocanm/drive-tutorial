import { drizzle } from "drizzle-orm/singlestore";
import { createPool, type Pool } from "mysql2/promise";
import { env } from "~/env";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  conn: Pool | undefined;
};

export const conn =
  globalForDb.conn ??
  createPool({
    host: env.SINGLESTORE_HOST,
    user: env.SINGLESTORE_USER,
    password: env.SINGLESTORE_PASSWORD,
    database: env.SINGLESTORE_DATABASE,
    port: Number(env.SINGLESTORE_PORT),
    ssl: {},
    maxIdle: 0,
  });

if (env.NODE_ENV !== "production") {
  globalForDb.conn = conn;
}

conn.addListener("error", (err) => {
  console.error("Database connection error:", err);
});

export const db = drizzle(conn, { schema, });