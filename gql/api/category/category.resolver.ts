import { Resolver, Query, Mutation, Arg } from "type-graphql";

import { Category } from "./category.model";
import { db } from "decorators/getPrismaClient.decorator";
import { PrismaClient } from "@prisma/client";
import { AuthGuard } from "decorators/auth.guard";
import { CurrentUser } from "decorators/currentUser.decorator";
import { checkEntryForUpsert, checkEntryForDelete } from "lib/checkEntry";

@Resolver(() => Category)
export class CategoryResolver {
  @Query(() => [Category])
  @AuthGuard()
  async getCategories(
    @db() prisma: PrismaClient,
    @CurrentUser() userId: string
  ): Promise<Category[]> {
    try {
      return await prisma.category.findMany({ where: { userId } });
    } catch (error) {
      return [];
    } finally {
      await prisma.$disconnect();
    }
  }

  @Mutation(() => Category, { nullable: true })
  @AuthGuard()
  async upsertCategory(
    @db() prisma: PrismaClient,
    @CurrentUser() userId: string,
    @Arg("categoryInput") category: Category
  ): Promise<Category | null> {
    try {
      const entry = await prisma.category.findOne({
        where: { id: category.id }
      });

      if (!checkEntryForUpsert<Category>(category, { entry, userId })) {
        return entry;
      }

      return await prisma.category.upsert({
        create: {
          ...category,
          user: {
            connect: {
              id: userId
            }
          }
        },
        update: {
          ...category,
          user: {
            connect: {
              id: userId
            }
          }
        },
        where: {
          id: category.id
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
  async deleteCategory(
    @db() prisma: PrismaClient,
    @CurrentUser() userId: string,
    @Arg("id") id: string,
    @Arg("deletedAt") deletedAt: Date
  ): Promise<Boolean> {
    try {
      const entry = await prisma.category.findOne({ where: { id } });
      if (!checkEntryForDelete<Category>(deletedAt, { entry, userId })) {
        return false;
      }
      return !!(await prisma.category.delete({
        where: { id }
      }));
    } catch (error) {
      return false;
    } finally {
      await prisma.$disconnect();
    }
  }
}
