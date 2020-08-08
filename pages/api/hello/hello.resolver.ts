import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { PrismaClient } from "@prisma/client";

import { Hello } from "./hello.model";

@Resolver(() => Hello)
export class HelloResolver {
  @Query(() => [Hello])
  async getHellos() {
    const prisma = new PrismaClient({ log: ["query"] });
    try {
      return await prisma.hello.findMany();
    } catch (error) {
      return null;
    } finally {
      await prisma.$disconnect();
    }
  }

  @Mutation(() => Hello, { nullable: true })
  async createHello(@Arg("message") message: string) {
    const prisma = new PrismaClient({ log: ["query"] });
    try {
      return await prisma.hello.create({
        data: {
          message
        }
      });
    } catch (error) {
      return null;
    } finally {
      await prisma.$disconnect();
    }
  }
}
