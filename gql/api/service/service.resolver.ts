import { Resolver, Query, Mutation, Arg } from "type-graphql";

import { Service } from "./service.model";
import { db } from "decorators/GetPrismaClient";
import { PrismaClient } from "@prisma/client";

@Resolver(() => Service)
export class ServiceResolver {
  @Query(() => [Service])
  async getServices(@db() prisma: PrismaClient): Promise<Service[]> {
    try {
      return await prisma.service.findMany();
    } catch (error) {
      return [];
    } finally {
      await prisma.$disconnect();
    }
  }

  @Mutation(() => Service, { nullable: true })
  async upsertService(
    @db() prisma: PrismaClient,
    @Arg("serviceInput") service: Service
  ): Promise<Service | null> {
    try {
      const entry = await prisma.service.findOne({ where: { id: service.id } });
      if (entry && entry.updatedAt > service.updatedAt) {
        return entry;
      }

      return await prisma.service.upsert({
        create: {
          ...service
        },
        update: {
          ...service
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
  async deleteService(
    @db() prisma: PrismaClient,
    @Arg("id") id: string,
    @Arg("deletedAt") deletedAt: Date
  ): Promise<Boolean> {
    try {
      const entry = await prisma.service.findOne({ where: { id } });
      if (entry && entry.updatedAt > deletedAt) {
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
