import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// 1. Initialize the adapter with your connection string
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// 2. Pass the adapter to the PrismaClient constructor
const prismaClientSingleton = () => {
  return new PrismaClient({ adapter });
};

const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
