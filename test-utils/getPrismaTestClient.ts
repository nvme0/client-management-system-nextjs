import { PrismaClient } from "@prisma/client";

export const getPrismaTestClient = () => {
  return new PrismaClient();
};
