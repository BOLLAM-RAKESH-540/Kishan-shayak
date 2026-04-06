import "dotenv/config";
import { defineConfig } from "prisma/config";

// 🟢 Tell TypeScript that process exists (Fixes error 2580)
declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("⚠️ Warning: DATABASE_URL is not defined in your .env file");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl || "", // 🟢 Ensures a string is passed even if env is missing
  },
});