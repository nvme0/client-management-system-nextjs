import { Resolver, Query, Mutation, Arg } from "type-graphql";

import { Client } from "./models/client.model";
import { db } from "decorators/getPrismaClient.decorator";
import { PrismaClient } from "@prisma/client";
import { AuthGuard } from "decorators/auth.guard";
import { CurrentUser } from "decorators/currentUser.decorator";
import { checkEntryForUpsert, checkEntryForDelete } from "lib/checkEntry";

@Resolver(() => Client)
export class ClientResolver {
  @Query(() => [Client])
  @AuthGuard()
  async getClients(
    @db() prisma: PrismaClient,
    @CurrentUser() userId: string
  ): Promise<Client[]> {
    try {
      return await prisma.client.findMany({
        where: { userId },
        include: {
          programs: {
            include: {
              program: {
                include: {
                  services: {
                    include: {
                      service: true
                    }
                  }
                }
              }
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

  @Mutation(() => Client, { nullable: true })
  @AuthGuard()
  async upsertClient(
    @db() prisma: PrismaClient,
    @CurrentUser() userId: string,
    @Arg("clientInput") clientInput: Client
  ): Promise<Client | null> {
    const { programs, ...client } = clientInput;
    try {
      const entry = await prisma.client.findOne({
        where: { id: client.id },
        include: {
          programs: {
            include: {
              program: {
                include: {
                  services: {
                    include: {
                      service: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!checkEntryForUpsert<Client>(clientInput, { entry, userId })) {
        return entry;
      }

      if (!entry) {
        // create the entity if it doesn't exist
        await prisma.client.create({
          data: {
            ...client,
            user: {
              connect: {
                id: userId
              }
            }
          }
        });
      } else {
        // delete all programToClient connections
        await prisma.programToClient.deleteMany({
          where: {
            clientId: client.id
          }
        });
      }

      // create programToClient connections
      await Promise.all(
        programs.map(
          async (program) =>
            await prisma.programToClient.create({
              data: {
                ...program,
                client: {
                  connect: {
                    id: client.id
                  }
                },
                program: {
                  connect: {
                    id: program.program.id
                  }
                }
              }
            })
        )
      );

      return await prisma.client.update({
        data: {
          ...client
        },
        where: {
          id: client.id
        },
        include: {
          programs: {
            include: {
              program: {
                include: {
                  services: {
                    include: {
                      service: true
                    }
                  }
                }
              }
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
  async deleteClient(
    @db() prisma: PrismaClient,
    @CurrentUser() userId: string,
    @Arg("id") id: string,
    @Arg("deletedAt") deletedAt: Date
  ): Promise<Boolean> {
    try {
      const entry = await prisma.client.findOne({
        where: { id },
        include: {
          programs: {
            include: {
              program: {
                include: {
                  services: {
                    include: {
                      service: true
                    }
                  }
                }
              }
            }
          }
        }
      });
      if (!checkEntryForDelete<Client>(deletedAt, { entry, userId })) {
        return false;
      }
      return !!(await prisma.client.delete({
        where: { id }
      }));
    } catch (error) {
      return false;
    } finally {
      await prisma.$disconnect();
    }
  }
}
