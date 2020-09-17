import { Resolver, Query, Mutation, Arg } from "type-graphql";

import { Program } from "./models/program.model";
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
        include: {
          services: {
            include: {
              service: true
            }
          }
        }
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
    const { services, ...program } = programInput;
    try {
      const entry = await prisma.program.findOne({
        where: { id: program.id },
        include: {
          services: {
            include: {
              service: true
            }
          }
        }
      });

      if (!checkEntryForUpsert<Program>(programInput, { entry, userId })) {
        return entry;
      }

      if (!entry) {
        // create the entity if it doesn't exist
        await prisma.program.create({
          data: {
            ...program,
            user: {
              connect: {
                id: userId
              }
            }
          }
        });
      } else {
        // delete all serviceToProgram connections
        await prisma.serviceToProgram.deleteMany({
          where: {
            programId: program.id
          }
        });
      }

      // create serviceToProgram connections
      await Promise.all(
        services.map(
          async (service) =>
            await prisma.serviceToProgram.create({
              data: {
                ...service,
                program: {
                  connect: {
                    id: program.id
                  }
                },
                service: {
                  connect: {
                    id: service.service.id
                  }
                }
              }
            })
        )
      );

      return await prisma.program.update({
        data: {
          ...program
        },
        where: {
          id: program.id
        },
        include: {
          services: {
            include: {
              service: true
            }
          }
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
  ): Promise<boolean> {
    try {
      const entry = await prisma.program.findOne({
        where: { id },
        include: {
          services: {
            include: {
              service: true
            }
          }
        }
      });
      if (!checkEntryForDelete<Program>(deletedAt, { entry, userId })) {
        return false;
      }
      if (entry?.services) {
        await prisma.serviceToProgram.deleteMany({
          where: {
            programId: entry.id
          }
        });
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
