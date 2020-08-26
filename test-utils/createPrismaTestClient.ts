import { PrismaClient } from "@prisma/client";

export const createPrismaTestClient = () => {
  return new PrismaClient();
};
