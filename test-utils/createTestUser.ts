import { PrismaClient, PrismaClientOptions } from "@prisma/client";
import faker from "faker";

export const createTestUser = (
  prisma: PrismaClient<PrismaClientOptions, never>,
  userId: string,
  userDetails: {
    firstName: string;
    lastName: string;
  }
) =>
  prisma.user.create({
    data: {
      id: userId,
      email: faker.internet.email(userDetails.firstName, userDetails.lastName),
      password: "testaccount"
    }
  });
