import { v4 as uuid } from "uuid";
import { ApolloServer } from "apollo-server-micro";
import { createTestClient } from "apollo-server-testing";
import { sign } from "jsonwebtoken";
import { PrismaClient, PrismaClientOptions } from "@prisma/client";

import {
  deleteClient,
  deleteService,
  deleteCalendarEvent
} from "test-utils/cleanDB";
import { createApolloTestServer } from "test-utils/createApolloTestServer";
import {
  GQL_UPSERT_CALENDAR_EVENT,
  GQL_DELETE_CALENDAR_EVENT,
  GQL_GET_CALENDAR_EVENTS
} from "gql/Calendar";
import { GQL_UPSERT_CLIENT } from "gql/Client";
import { GQL_UPSERT_SERVICE } from "gql/Service";
import {
  CalendarEventInput,
  ClientInput,
  ServiceInput
} from "gql/__generated__/globalTypes";
import { GetCalendarEvents_getCalendarEvents } from "gql/__generated__/GetCalendarEvents";
import { configuration } from "lib/config";
import { createPrismaTestClient } from "test-utils/createPrismaTestClient";
import { createTestUser } from "test-utils/createTestUser";
import { User } from "../user/models/user.model";

describe("Calendar Resolver", () => {
  let apolloServer: ApolloServer;
  const calendarIds: string[] = [];
  const clientIds: string[] = [];
  const serviceIds: string[] = [];
  let prisma: PrismaClient<PrismaClientOptions, never>;
  let user: User;

  beforeAll(async () => {
    prisma = createPrismaTestClient();
    const userId = uuid();
    user = await createTestUser(prisma, userId, {
      firstName: "calendar",
      lastName: "resolver"
    });

    const access_token = sign(
      { sub: userId },
      configuration.JWT_ACCESS_SECRET,
      {
        expiresIn: `60s`
      }
    );
    apolloServer = await createApolloTestServer({
      authorization: `Bearer ${access_token}`
    });
  });

  afterAll(async () => {
    await Promise.all(
      calendarIds.map(async (id) => await deleteCalendarEvent(id))
    );
    await Promise.all(clientIds.map(async (id) => await deleteClient(id)));
    await Promise.all(serviceIds.map(async (id) => await deleteService(id)));
    await prisma.user.delete({ where: { id: user.id } });
    prisma.$disconnect();
  });

  it("creates a new Event", async () => {
    const { mutate } = createTestClient(apolloServer);
    const calendarId = uuid();
    calendarIds.push(calendarId);

    const calendarEventInput: CalendarEventInput = {
      id: calendarId,
      title: "My Event 1",
      start: "2020-08-15T15:09:20.819Z",
      end: "2020-08-15T15:09:23.819Z",
      allDay: false,
      createdAt: "2020-08-26T11:47:50.472Z",
      updatedAt: "2020-08-26T11:47:50.472Z"
    };

    const response = await mutate({
      mutation: GQL_UPSERT_CALENDAR_EVENT,
      variables: {
        calendarEventInput
      }
    });

    expect(response).toMatchObject({
      data: {
        upsertCalendarEvent: {
          ...calendarEventInput,
          client: null,
          service: null,
          notes: null,
          resource: null
        }
      }
    });
  });

  it("creates a new Event with a Client", async () => {
    const { mutate } = createTestClient(apolloServer);
    const calendarId = uuid();
    calendarIds.push(calendarId);
    const clientId = uuid();
    clientIds.push(clientId);

    const clientInput: ClientInput = {
      id: clientId,
      firstName: "Jim",
      lastName: "Jones",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    await mutate({
      mutation: GQL_UPSERT_CLIENT,
      variables: {
        clientInput
      }
    });

    const calendarEventInput: CalendarEventInput = {
      id: calendarId,
      title: "My Event 2",
      start: "2020-08-15T15:09:20.819Z",
      end: "2020-08-15T15:09:23.819Z",
      allDay: false,
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z",
      client: clientInput
    };

    const response = await mutate({
      mutation: GQL_UPSERT_CALENDAR_EVENT,
      variables: {
        calendarEventInput
      }
    });

    expect(response).toMatchObject({
      data: {
        upsertCalendarEvent: {
          ...calendarEventInput,
          service: null,
          notes: null
        }
      }
    });
  });

  it("creates a new Event with a Client and a Service", async () => {
    const { mutate } = createTestClient(apolloServer);
    const calendarId = uuid();
    calendarIds.push(calendarId);
    const clientId = uuid();
    clientIds.push(clientId);
    const serviceId = uuid();
    serviceIds.push(serviceId);

    const clientInput: ClientInput = {
      id: clientId,
      firstName: "Jim",
      lastName: "Jones",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    await mutate({
      mutation: GQL_UPSERT_CLIENT,
      variables: {
        clientInput
      }
    });

    const serviceInput: ServiceInput = {
      id: serviceId,
      name: "My Service 3",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    await mutate({
      mutation: GQL_UPSERT_SERVICE,
      variables: {
        serviceInput
      }
    });

    const calendarEventInput: CalendarEventInput = {
      id: calendarId,
      title: "My Event 2",
      start: "2020-08-15T15:09:20.819Z",
      end: "2020-08-15T15:09:23.819Z",
      allDay: false,
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z",
      client: clientInput,
      service: serviceInput
    };

    const response = await mutate({
      mutation: GQL_UPSERT_CALENDAR_EVENT,
      variables: {
        calendarEventInput
      }
    });

    expect(response).toMatchObject({
      data: {
        upsertCalendarEvent: {
          ...calendarEventInput
        }
      }
    });
  });

  it("updates an Event with a Client and a Service", async () => {
    const { mutate } = createTestClient(apolloServer);
    const calendarId = uuid();
    calendarIds.push(calendarId);
    const clientId = uuid();
    clientIds.push(clientId);
    const serviceId = uuid();
    serviceIds.push(serviceId);

    const calendarEventInput1: CalendarEventInput = {
      id: calendarId,
      title: "My Event 3",
      start: "2020-08-15T15:09:20.819Z",
      end: "2020-08-15T15:09:23.819Z",
      allDay: false,
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    await mutate({
      mutation: GQL_UPSERT_CALENDAR_EVENT,
      variables: {
        calendarEventInput: calendarEventInput1
      }
    });

    const clientInput: ClientInput = {
      id: clientId,
      firstName: "Jim",
      lastName: "Jones",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    await mutate({
      mutation: GQL_UPSERT_CLIENT,
      variables: {
        clientInput
      }
    });

    const serviceInput: ServiceInput = {
      id: serviceId,
      name: "My Service 3",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    await mutate({
      mutation: GQL_UPSERT_SERVICE,
      variables: {
        serviceInput
      }
    });

    const calendarEventInput2: CalendarEventInput = {
      id: calendarId,
      title: "My Event 2",
      start: "2020-08-15T15:09:20.819Z",
      end: "2020-08-15T15:09:23.819Z",
      allDay: false,
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:19.819Z",
      client: clientInput,
      service: serviceInput
    };

    const response = await mutate({
      mutation: GQL_UPSERT_CALENDAR_EVENT,
      variables: {
        calendarEventInput: calendarEventInput2
      }
    });

    expect(response).toMatchObject({
      data: {
        upsertCalendarEvent: {
          ...calendarEventInput2
        }
      }
    });
  });

  it("updates an Event", async () => {
    const { mutate } = createTestClient(apolloServer);
    const calendarId = uuid();
    calendarIds.push(calendarId);

    const calendarEventInput1: CalendarEventInput = {
      id: calendarId,
      title: "My Event 4",
      start: "2020-08-15T15:09:20.819Z",
      end: "2020-08-15T15:09:23.819Z",
      allDay: false,
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const calendarEventInput2: CalendarEventInput = {
      id: calendarId,
      title: "My Event 5",
      start: "2020-08-15T15:09:20.819Z",
      end: "2020-08-15T15:09:23.819Z",
      allDay: false,
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:19.819Z"
    };

    await mutate({
      mutation: GQL_UPSERT_CALENDAR_EVENT,
      variables: {
        calendarEventInput: calendarEventInput1
      }
    });

    const response = await mutate({
      mutation: GQL_UPSERT_CALENDAR_EVENT,
      variables: {
        calendarEventInput: calendarEventInput2
      }
    });

    expect(response).toMatchObject({
      data: {
        upsertCalendarEvent: {
          ...calendarEventInput2
        }
      }
    });
  });

  it("does not update an Event", async () => {
    const { mutate } = createTestClient(apolloServer);
    const calendarId = uuid();
    calendarIds.push(calendarId);

    const calendarEventInput1: CalendarEventInput = {
      id: calendarId,
      title: "My Event 4",
      start: "2020-08-15T15:09:20.819Z",
      end: "2020-08-15T15:09:23.819Z",
      allDay: false,
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const calendarEventInput2: CalendarEventInput = {
      id: calendarId,
      title: "My Event 5",
      start: "2020-08-15T15:09:20.819Z",
      end: "2020-08-15T15:09:23.819Z",
      allDay: false,
      createdAt: "2020-08-15T15:09:16.819Z",
      updatedAt: "2020-08-15T15:09:16.819Z"
    };

    await mutate({
      mutation: GQL_UPSERT_CALENDAR_EVENT,
      variables: {
        calendarEventInput: calendarEventInput1
      }
    });

    const response = await mutate({
      mutation: GQL_UPSERT_CALENDAR_EVENT,
      variables: {
        calendarEventInput: calendarEventInput2
      }
    });

    expect(response).toMatchObject({
      data: {
        upsertCalendarEvent: {
          ...calendarEventInput1
        }
      }
    });
  });

  it("deletes an Event", async () => {
    const { mutate } = createTestClient(apolloServer);
    const calendarEventInput: CalendarEventInput = {
      id: uuid(),
      title: "My Event 4",
      start: "2020-08-15T15:09:20.819Z",
      end: "2020-08-15T15:09:23.819Z",
      allDay: false,
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    await mutate({
      mutation: GQL_UPSERT_CALENDAR_EVENT,
      variables: {
        calendarEventInput
      }
    });

    const response = await mutate({
      mutation: GQL_DELETE_CALENDAR_EVENT,
      variables: {
        id: calendarEventInput.id,
        deletedAt: new Date().toISOString()
      }
    });

    expect(response).toMatchObject({
      data: {
        deleteCalendarEvent: true
      }
    });
  });

  it("deletes an Event with a Client and a Service", async () => {
    const { mutate } = createTestClient(apolloServer);
    const clientId = uuid();
    clientIds.push(clientId);
    const serviceId = uuid();
    serviceIds.push(serviceId);

    const calendarEventInput: CalendarEventInput = {
      id: uuid(),
      title: "My Event 7",
      start: "2020-08-15T15:09:20.819Z",
      end: "2020-08-15T15:09:23.819Z",
      allDay: false,
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    await mutate({
      mutation: GQL_UPSERT_CALENDAR_EVENT,
      variables: {
        calendarEventInput
      }
    });

    const clientInput: ClientInput = {
      id: clientId,
      firstName: "Jim",
      lastName: "Jones",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    await mutate({
      mutation: GQL_UPSERT_CLIENT,
      variables: {
        clientInput
      }
    });

    const serviceInput: ServiceInput = {
      id: serviceId,
      name: "My Service 3",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    await mutate({
      mutation: GQL_UPSERT_SERVICE,
      variables: {
        serviceInput
      }
    });

    const response = await mutate({
      mutation: GQL_DELETE_CALENDAR_EVENT,
      variables: {
        id: calendarEventInput.id,
        deletedAt: new Date().toISOString()
      }
    });

    expect(response).toMatchObject({
      data: {
        deleteCalendarEvent: true
      }
    });
  });

  it("does not delete an Event", async () => {
    const calendarId = uuid();
    calendarIds.push(calendarId);

    const { mutate } = createTestClient(apolloServer);
    const calendarEventInput: CalendarEventInput = {
      id: calendarId,
      title: "My Event 4",
      start: "2020-08-15T15:09:20.819Z",
      end: "2020-08-15T15:09:23.819Z",
      allDay: false,
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    await mutate({
      mutation: GQL_UPSERT_CALENDAR_EVENT,
      variables: {
        calendarEventInput
      }
    });

    const response = await mutate({
      mutation: GQL_DELETE_CALENDAR_EVENT,
      variables: {
        id: calendarEventInput.id,
        deletedAt: "2020-08-15T15:09:17.819Z"
      }
    });

    expect(response).toMatchObject({
      data: {
        deleteCalendarEvent: false
      }
    });
  });

  it("lists all events", async () => {
    const { mutate } = createTestClient(apolloServer);
    const ids = [uuid(), uuid(), uuid()];
    ids.forEach((id) => calendarIds.push(id));

    const calendarEventInput1: CalendarEventInput = {
      id: ids[0],
      title: "My Event 8",
      start: "2020-08-15T15:09:20.819Z",
      end: "2020-08-15T15:09:23.819Z",
      allDay: false,
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const calendarEventInput2: CalendarEventInput = {
      id: ids[1],
      title: "My Event 9",
      start: "2020-08-15T15:09:20.819Z",
      end: "2020-08-15T15:09:23.819Z",
      allDay: false,
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const calendarEventInput3: CalendarEventInput = {
      id: ids[2],
      title: "My Event 6",
      start: "2020-08-15T15:09:20.819Z",
      end: "2020-08-15T15:09:23.819Z",
      allDay: false,
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    await mutate({
      mutation: GQL_UPSERT_CALENDAR_EVENT,
      variables: {
        calendarEventInput: calendarEventInput1
      }
    });
    await mutate({
      mutation: GQL_UPSERT_CALENDAR_EVENT,
      variables: {
        calendarEventInput: calendarEventInput2
      }
    });
    await mutate({
      mutation: GQL_UPSERT_CALENDAR_EVENT,
      variables: {
        calendarEventInput: calendarEventInput3
      }
    });

    const response = await mutate({
      mutation: GQL_GET_CALENDAR_EVENTS
    });

    const getCalendarEvents: GetCalendarEvents_getCalendarEvents[] =
      response.data?.getCalendarEvents;

    expect(
      getCalendarEvents.find(
        (calendarEvent) => calendarEvent.id === calendarEventInput1.id
      )
    ).toEqual({
      ...calendarEventInput1,
      client: null,
      service: null,
      notes: null,
      resource: null
    });
    expect(
      getCalendarEvents.find(
        (calendarEvent) => calendarEvent.id === calendarEventInput2.id
      )
    ).toEqual({
      ...calendarEventInput2,
      client: null,
      service: null,
      notes: null,
      resource: null
    });
    expect(
      getCalendarEvents.find(
        (calendarEvent) => calendarEvent.id === calendarEventInput3.id
      )
    ).toEqual({
      ...calendarEventInput3,
      client: null,
      service: null,
      notes: null,
      resource: null
    });
  });
});
