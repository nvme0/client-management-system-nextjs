import { createParamDecorator } from "type-graphql";
import { PrismaClient } from "@prisma/client";

export const db = () => {
  return createParamDecorator<{ prisma: PrismaClient }>(
    ({ context }) => context.prisma
  );
};
