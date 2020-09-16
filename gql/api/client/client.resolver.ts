import { Resolver, Query, Mutation, Arg } from "type-graphql";

import { Client } from "./models/client.model";
import { db } from "decorators/getPrismaClient.decorator";
import { PrismaClient } from "@prisma/client";
import { AuthGuard } from "decorators/auth.guard";
import { CurrentUser } from "decorators/currentUser.decorator";
import { checkEntryForUpsert, checkEntryForDelete } from "lib/checkEntry";

const generateAddUpdateRemoveIds = ({
  current,
  stored
}: {
  current: string[];
  stored: string[];
}) => {
  const removeIds = stored.filter((id) => !current.find((_id) => _id === id));
  const updateIds = stored.filter((id) => current.find((_id) => _id === id));
  const addIds = current.filter((id) => !updateIds.find((_id) => _id === id));
  return { addIds, updateIds, removeIds };
};

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
              services: {
                include: {
                  service: true
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
      let entry = await prisma.client.findOne({
        where: { id: client.id },
        include: {
          programs: {
            include: {
              services: {
                include: {
                  service: true
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
        entry = await prisma.client.create({
          data: {
            ...client,
            user: {
              connect: {
                id: userId
              }
            }
          },
          include: {
            programs: {
              include: {
                services: {
                  include: {
                    service: true
                  }
                }
              }
            }
          }
        });
      }

      const programIds = programs.map(({ id }) => id);
      const storedProgramIds = entry.programs.map(({ id }) => id);
      const { addIds, updateIds, removeIds } = generateAddUpdateRemoveIds({
        current: programIds,
        stored: storedProgramIds
      });

      // remove programToClient connections in removeIds
      await Promise.all(
        removeIds.map(async (id) => {
          await prisma.serviceToProgramToClient.deleteMany({
            where: {
              programId: id
            }
          });
          return await prisma.programToClient.delete({
            where: {
              id
            }
          });
        })
      );

      // update programToClient connections in updateIds
      await Promise.all(
        updateIds.map(async (id) => {
          const { services, ...program } = programs.find(
            ({ id: programId }) => programId === id
          )!;
          const { services: storedServices } = entry!.programs.find(
            ({ id: programId }) => programId === id
          )!;

          const serviceIds = services.map(({ service: { id } }) => id);
          const storedServiceIds = storedServices.map(
            ({ service: { id } }) => id
          );
          const {
            addIds: serviceAddIds,
            updateIds: serviceUpdateIds,
            removeIds: serviceRemoveIds
          } = generateAddUpdateRemoveIds({
            current: serviceIds,
            stored: storedServiceIds
          });

          // create, update or remove
          await prisma.programToClient.update({
            where: {
              id: program.id
            },
            data: {
              ...program,
              client: {
                connect: {
                  id: client.id
                }
              },
              services: {
                create: serviceAddIds.map((serviceId) => {
                  const { service, ...rest } = services.find(
                    ({ service: { id: _id } }) => _id === serviceId
                  )!;
                  return {
                    ...rest,
                    service: {
                      connect: {
                        id: serviceId
                      }
                    }
                  };
                }),
                deleteMany: serviceRemoveIds.map((removeId) => ({
                  serviceId: removeId,
                  programId: program.id
                })),
                updateMany: serviceUpdateIds.map((serviceId) => ({
                  where: {
                    serviceId,
                    programId: program.id
                  },
                  data: (() => {
                    const { service, ...rest } = services.find(
                      ({ service: { id: _id } }) => _id === serviceId
                    )!;
                    return {
                      ...rest
                    };
                  })()
                }))
              }
            }
          });
        })
      );

      // create programToClient connections in addIds
      await Promise.all(
        addIds.map(async (id) => {
          const { services, ...program } = programs.find(
            ({ id: programId }) => programId === id
          )!;
          return await prisma.programToClient.create({
            data: {
              ...program,
              client: {
                connect: {
                  id: client.id
                }
              },
              services: {
                create: services.map(({ service, ...rest }) => ({
                  ...rest,
                  service: {
                    connect: {
                      id: service.id
                    }
                  }
                }))
              }
            }
          });
        })
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
              services: {
                include: {
                  service: true
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
              services: {
                include: {
                  service: true
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
