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
      return await prisma.program.findMany({ where: { userId } });
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
    @Arg("programInput") program: Program
  ): Promise<Program | null> {
    try {
      const entry = await prisma.program.findOne({
        where: { id: program.id }
      });

      if (!checkEntryForUpsert<Program>(program, { entry, userId })) {
        return entry;
      }

      return await prisma.program.upsert({
        create: {
          ...program,
          user: {
            connect: {
              id: userId
            }
          }
        },
        update: {
          ...program,
          user: {
            connect: {
              id: userId
            }
          }
        },
        where: {
          id: program.id
        }
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
      const entry = await prisma.program.findOne({ where: { id } });
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
