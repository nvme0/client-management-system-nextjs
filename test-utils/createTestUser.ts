import { PrismaClient, PrismaClientOptions } from "@prisma/client";

export const createTestUser = (
  prisma: PrismaClient<PrismaClientOptions, never>,
  userId: string
) =>
  prisma.user.create({
    data: {
      id: userId,
      email: "testaccount@jest.com",
      password: "testaccount"
    }
  });
