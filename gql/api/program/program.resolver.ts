import { Resolver, Query, Mutation, Arg } from "type-graphql";

import { Program } from "./program.model";
import { db } from "decorators/getPrismaClient.decorator";
import { PrismaClient } from "@prisma/client";
import { AuthGuard } from "decorators/auth.guard";
import { CurrentUser } from "decorators/currentUser.decorator";
import { checkEntryForUpsert, checkEntryForDelete } from "lib/checkEntry";

@Resolver(() => Program)
export class ProgramResolver {
  @Query(() => [Program])
  @AuthGuard()
  async getPrograms(
    @db() prisma: PrismaClient,
    @CurrentUser() userId: string
  ): Promise<Program[]> {
    try {
      return await prisma.program.findMany({
        where: { userId },
        include: { categories: true }
      });
    } catch (error) {
      return [];
    } finally {
      await prisma.$disconnect();
    }
  }

  @Mutation(() => Program, { nullable: true })
  @AuthGuard()
  async upsertProgram(
    @db() prisma: PrismaClient,
    @CurrentUser() userId: string,
    @Arg("programInput") programInput: Program
  ): Promise<Program | null> {
    const { categories, ...program } = programInput;
    try {
      const entry = await prisma.program.findOne({
        where: { id: program.id },
        include: { categories: true }
      });

      if (!checkEntryForUpsert<Program>(programInput, { entry, userId })) {
        return entry;
      }

      return await prisma.program.upsert({
        create: {
          ...program,
          user: {
            connect: {
              id: userId
            }
          },
          categories: {
            connect: categories.map(({ id }) => ({ id }))
          }
        },
        update: {
          ...program,
          user: {
            connect: {
              id: userId
            }
          },
          categories: {
            set: categories.map(({ id }) => ({ id }))
          }
        },
        where: {
          id: program.id
        },
        include: { categories: true }
      });
    } catch (error) {
      console.log({ error });
      return null;
    } finally {
      await prisma.$disconnect();
    }
  }

  @Mutation(() => Boolean)
  @AuthGuard()
  async deleteProgram(
    @db() prisma: PrismaClient,
    @CurrentUser() userId: string,
    @Arg("id") id: string,
    @Arg("deletedAt") deletedAt: Date
  ): Promise<Boolean> {
    try {
      const entry = await prisma.program.findOne({
        where: { id },
        include: { categories: true }
      });
      if (!checkEntryForDelete<Program>(deletedAt, { entry, userId })) {
        return false;
      }
      return !!(await prisma.program.delete({
        where: { id }
      }));
    } catch (error) {
      return false;
    } finally {
      await prisma.$disconnect();
    }
  }
}
