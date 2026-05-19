import "dotenv/config";
import { prisma } from "../DB/connection.db";

async function main() {
  try {
    const res = await prisma.$queryRaw`SELECT 1 as result`;
    console.log("DB test query result:", res);
  } catch (e) {
    console.error("DB test query failed:", e);
    process.exitCode = 1;
  }
}

main();
