import { Resolver, Query, Mutation, Arg } from "type-graphql";

import { CalendarEvent } from "./calendar.model";
import { db } from "decorators/getPrismaClient.decorator";
import { PrismaClient } from "@prisma/client";
import { AuthGuard } from "decorators/auth.guard";
import { CurrentUser } from "decorators/currentUser.decorator";
import { checkEntryForUpsert, checkEntryForDelete } from "lib/checkEntry";

@Resolver(() => CalendarEvent)
export class CalendarEventResolver {
  @Query(() => [CalendarEvent])
  @AuthGuard()
  async getCalendarEvents(
    @db() prisma: PrismaClient,
    @CurrentUser() userId: string
  ): Promise<CalendarEvent[]> {
    try {
      return await prisma.calendarEvent.findMany({
        where: { userId },
        include: {
          client: true,
          service: true
        }
      });
    } catch (error) {
      return [];
    } finally {
      await prisma.$disconnect();
    }
  }

  @Mutation(() => CalendarEvent, { nullable: true })
  @AuthGuard()
  async upsertCalendarEvent(
    @db() prisma: PrismaClient,
    @CurrentUser() userId: string,
    @Arg("calendarEventInput") calendarEventInput: CalendarEvent
  ): Promise<CalendarEvent | null> {
    const { client, service, resource, ...calendarEvent } = calendarEventInput;
    try {
      const entry = await prisma.calendarEvent.findOne({
        where: { id: calendarEvent.id },
        include: {
          client: true,
          service: true
        }
      });

      if (
        !checkEntryForUpsert<CalendarEvent>(calendarEventInput, {
          entry,
          userId
        })
      ) {
        return entry;
      }

      return await prisma.calendarEvent.upsert({
        create: {
          ...calendarEvent,
          client: client
            ? {
                connect: {
                  id: client.id
                }
              }
            : undefined,
          service: service
            ? {
                connect: {
                  id: service.id
                }
              }
            : undefined,
          user: {
            connect: {
              id: userId
            }
          }
        },
        update: {
          ...calendarEvent,
          client: client
            ? {
                connect: {
                  id: client.id
                }
              }
            : undefined,
          service: service
            ? {
                connect: {
                  id: service.id
                }
              }
            : undefined,
          user: {
            connect: {
              id: userId
            }
          }
        },
        where: {
          id: calendarEvent.id
        },
        include: {
          client: true,
          service: true
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
  async deleteCalendarEvent(
    @db() prisma: PrismaClient,
    @CurrentUser() userId: string,
    @Arg("id") id: string,
    @Arg("deletedAt") deletedAt: Date
  ): Promise<Boolean> {
    try {
      const entry = await prisma.calendarEvent.findOne({
        where: { id }
      });
      if (!checkEntryForDelete<CalendarEvent>(deletedAt, { entry, userId })) {
        return false;
      }
      return !!(await prisma.calendarEvent.delete({
        where: { id }
      }));
    } catch (error) {
      return false;
    } finally {
      await prisma.$disconnect();
    }
  }
}
