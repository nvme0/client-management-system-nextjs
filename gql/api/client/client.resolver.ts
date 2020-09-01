import { Resolver, Query, Mutation, Arg } from "type-graphql";

import { Client } from "./client.model";
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
      return await prisma.client.findMany({ where: { userId } });
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
    @Arg("clientInput") client: Client
  ): Promise<Client | null> {
    try {
      const entry = await prisma.client.findOne({
        where: { id: client.id }
      });

      if (!checkEntryForUpsert<Client>(client, { entry, userId })) {
        return entry;
      }

      return await prisma.client.upsert({
        create: {
          ...client,
          user: {
            connect: {
              id: userId
            }
          }
        },
        update: {
          ...client,
          user: {
            connect: {
              id: userId
            }
          }
        },
        where: {
          id: client.id
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
      const entry = await prisma.client.findOne({ where: { id } });
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
