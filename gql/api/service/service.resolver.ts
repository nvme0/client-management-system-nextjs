import { Resolver, Query, Mutation, Arg } from "type-graphql";

import { Service } from "./service.model";
import { db } from "decorators/getPrismaClient.decorator";
import { PrismaClient } from "@prisma/client";
import { AuthGuard } from "decorators/auth.guard";
import { CurrentUser } from "decorators/currentUser.decorator";
import { checkEntryForUpsert, checkEntryForDelete } from "lib/checkEntry";

@Resolver(() => Service)
export class ServiceResolver {
  @Query(() => [Service])
  @AuthGuard()
  async getServices(
    @db() prisma: PrismaClient,
    @CurrentUser() userId: string
  ): Promise<Service[]> {
    try {
      return await prisma.service.findMany({ where: { userId } });
    } catch (error) {
      return [];
    } finally {
      await prisma.$disconnect();
    }
  }

  @Mutation(() => Service, { nullable: true })
  @AuthGuard()
  async upsertService(
    @db() prisma: PrismaClient,
    @CurrentUser() userId: string,
    @Arg("serviceInput") service: Service
  ): Promise<Service | null> {
    try {
      const entry = await prisma.service.findOne({
        where: { id: service.id }
      });

      if (!checkEntryForUpsert<Service>(service, { entry, userId })) {
        return entry;
      }

      return await prisma.service.upsert({
        create: {
          ...service,
          user: {
            connect: {
              id: userId
            }
          }
        },
        update: {
          ...service,
          user: {
            connect: {
              id: userId
            }
          }
        },
        where: {
          id: service.id
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
  async deleteService(
    @db() prisma: PrismaClient,
    @CurrentUser() userId: string,
    @Arg("id") id: string,
    @Arg("deletedAt") deletedAt: Date
  ): Promise<Boolean> {
    try {
      const entry = await prisma.service.findOne({ where: { id } });
      if (!checkEntryForDelete<Service>(deletedAt, { entry, userId })) {
        return false;
      }
      return !!(await prisma.service.delete({
        where: { id }
      }));
    } catch (error) {
      return false;
    } finally {
      await prisma.$disconnect();
    }
  }
}
