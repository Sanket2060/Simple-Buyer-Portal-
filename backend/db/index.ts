import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

import process from "process";

// 1. Setup the connection pool (Required for the adapter)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// 2. Initialize the client immediately
const prisma = new PrismaClient({ adapter });

const connectDB = async () => {
  try {
    // Prisma connects lazily, but we can force a check with $connect
    await prisma.$connect();
    console.log("Postgresql neon database connected successfully");
  } catch (error) {
    console.log("Postgresql neon database connection FAILED ", error);
    process.exit(1);
  }
};

export { connectDB };
export default prisma;
