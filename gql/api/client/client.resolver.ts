import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { v4 as uuid } from "uuid";

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
          },
          paymentPlans: {
            include: {
              installments: true
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
    const { programs, paymentPlans, ...client } = clientInput;
    console.log({ client });
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
          },
          paymentPlans: {
            include: {
              installments: true
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
            },
            paymentPlans: {
              include: {
                installments: true
              }
            }
          }
        });
      }

      const paymentIds = paymentPlans.map(({ id }) => id);
      const storedPaymentIds = entry.paymentPlans.map(({ id }) => id);
      const {
        addIds: addPaymentPlansIds,
        updateIds: updatePaymentPlansIds,
        removeIds: removePaymentPlansIds
      } = generateAddUpdateRemoveIds({
        current: paymentIds,
        stored: storedPaymentIds
      });

      // remove paymentPlan connections in removePaymentPlansIds
      await Promise.all(
        removePaymentPlansIds.map(async (id) => {
          await prisma.installment.deleteMany({
            where: {
              paymentPlanId: id
            }
          });
          return await prisma.paymentPlan.delete({
            where: {
              id
            }
          });
        })
      );

      // update paymentPlan connections in updatePaymentPlansIds
      await Promise.all(
        updatePaymentPlansIds.map(async (id) => {
          const installments = paymentPlans.find(({ id: _id }) => _id === id)!
            .installments;
          // remove installments for client
          await prisma.installment.deleteMany({
            where: {
              paymentPlanId: id
            }
          });
          // create installments for client
          await Promise.all(
            installments.map(
              async (installment) =>
                await prisma.installment.create({
                  data: {
                    id: uuid(),
                    amount: installment.amount,
                    currency: installment.currency,
                    date: installment.date,
                    paymentPlan: {
                      connect: {
                        id
                      }
                    }
                  }
                })
            )
          );
        })
      );

      // create paymentPlan connections in addPaymentPlansIds
      await Promise.all(
        addPaymentPlansIds.map(async (id) => {
          const { installments, ...paymentPlan } = paymentPlans.find(
            ({ id: paymentPlanId }) => paymentPlanId === id
          )!;
          return await prisma.paymentPlan.create({
            data: {
              id: paymentPlan.id,
              notes: paymentPlan.notes,
              installments: {
                create: installments.map(({ amount, currency, date }) => ({
                  id: uuid(),
                  amount,
                  currency,
                  date
                }))
              },
              client: {
                connect: {
                  id: client.id
                }
              }
            }
          });
        })
      );

      const programIds = programs.map(({ id }) => id);
      const storedProgramIds = entry.programs.map(({ id }) => id);
      const {
        addIds: addProgramIds,
        updateIds: updateProgramIds,
        removeIds: removeProgramIds
      } = generateAddUpdateRemoveIds({
        current: programIds,
        stored: storedProgramIds
      });

      // remove programToClient connections in removeProgramIds
      await Promise.all(
        removeProgramIds.map(async (id) => {
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

      // update programToClient connections in updateProgramIds
      await Promise.all(
        updateProgramIds.map(async (id) => {
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

      // create programToClient connections in addProgramIds
      await Promise.all(
        addProgramIds.map(async (id) => {
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
          },
          paymentPlans: {
            include: {
              installments: true
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
  ): Promise<boolean> {
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
          },
          paymentPlans: {
            include: {
              installments: true
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
