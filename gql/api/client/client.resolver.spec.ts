import { v4 as uuid } from "uuid";
import { ApolloServer } from "apollo-server-micro";
import { createTestClient } from "apollo-server-testing";
import { sign } from "jsonwebtoken";
import { PrismaClient, PrismaClientOptions } from "@prisma/client";

import { deleteClient } from "test-utils/cleanDB";
import { createApolloTestServer } from "test-utils/createApolloTestServer";
import {
  GQL_UPSERT_CLIENT,
  GQL_DELETE_CLIENT,
  GQL_GET_CLIENTS
} from "gql/Client";
import { ClientInput } from "gql/__generated__/globalTypes";
import { GetClients_getClients } from "gql/__generated__/GetClients";
import { configuration } from "lib/config";
import { createPrismaTestClient } from "test-utils/createPrismaTestClient";
import { createTestUser } from "test-utils/createTestUser";
import { User } from "../user/models/user.model";

describe("Client Resolver", () => {
  let apolloServer: ApolloServer;
  const ids: string[] = [];
  let prisma: PrismaClient<PrismaClientOptions, never>;
  let user: User;

  beforeAll(async () => {
    prisma = createPrismaTestClient();
    const userId = uuid();
    user = await createTestUser(prisma, userId, {
      firstName: "client",
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
    ids.forEach((id) => deleteClient(id));
    await prisma.user.delete({ where: { id: user.id } });
    prisma.$disconnect();
  });

  it("creates a new Client", async () => {
    const clientId = uuid();
    ids.push(clientId);

    const clientInput: ClientInput = {
      id: clientId,
      firstName: "Jimmy",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const { mutate } = createTestClient(apolloServer);
    const response = await mutate({
      mutation: GQL_UPSERT_CLIENT,
      variables: {
        clientInput
      }
    });

    expect(response).toMatchObject({
      data: {
        upsertClient: {
          ...clientInput,
          lastName: null,
          address: null,
          contactEmail: null,
          contactNumber: null,
          notes: null
        }
      }
    });
  });

  it("updates a Client", async () => {
    const clientId = uuid();
    ids.push(clientId);

    const clientInput1: ClientInput = {
      id: clientId,
      firstName: "Mark",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const clientInput2: ClientInput = {
      id: clientId,
      firstName: "Sarah",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const { mutate } = createTestClient(apolloServer);
    await mutate({
      mutation: GQL_UPSERT_CLIENT,
      variables: {
        clientInput: clientInput1
      }
    });

    const response = await mutate({
      mutation: GQL_UPSERT_CLIENT,
      variables: {
        clientInput: clientInput2
      }
    });

    expect(response).toMatchObject({
      data: {
        upsertClient: {
          ...clientInput2,
          lastName: null,
          address: null,
          contactEmail: null,
          contactNumber: null,
          notes: null
        }
      }
    });
  });

  it("does not update a Client", async () => {
    const clientId = uuid();
    ids.push(clientId);

    const clientInput1: ClientInput = {
      id: clientId,
      firstName: "Howard",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const clientInput2: ClientInput = {
      id: clientId,
      firstName: "Ocean",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:17.819Z"
    };

    const { mutate } = createTestClient(apolloServer);
    await mutate({
      mutation: GQL_UPSERT_CLIENT,
      variables: {
        clientInput: clientInput1
      }
    });

    const response = await mutate({
      mutation: GQL_UPSERT_CLIENT,
      variables: {
        clientInput: clientInput2
      }
    });

    expect(response).toMatchObject({
      data: {
        upsertClient: {
          ...clientInput1,
          lastName: null,
          address: null,
          contactEmail: null,
          contactNumber: null,
          notes: null
        }
      }
    });
  });

  it("deletes a Client", async () => {
    const clientInput: ClientInput = {
      id: uuid(),
      firstName: "Kim",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const { mutate } = createTestClient(apolloServer);
    await mutate({
      mutation: GQL_UPSERT_CLIENT,
      variables: {
        clientInput: clientInput
      }
    });

    const response = await mutate({
      mutation: GQL_DELETE_CLIENT,
      variables: {
        id: clientInput.id,
        deletedAt: new Date()
      }
    });

    expect(response).toMatchObject({
      data: {
        deleteClient: true
      }
    });
  });

  it("does not delete a Client", async () => {
    const clientId = uuid();
    ids.push(clientId);

    const clientInput: ClientInput = {
      id: clientId,
      firstName: "Harry",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const { mutate } = createTestClient(apolloServer);
    await mutate({
      mutation: GQL_UPSERT_CLIENT,
      variables: {
        clientInput: clientInput
      }
    });

    const response = await mutate({
      mutation: GQL_DELETE_CLIENT,
      variables: {
        id: clientInput.id,
        deletedAt: "2020-08-15T15:09:17.819Z"
      }
    });

    expect(response).toMatchObject({
      data: {
        deleteClient: false
      }
    });
  });

  it("lists all clients", async () => {
    const clientIds = [uuid(), uuid(), uuid()];
    clientIds.forEach((clientId) => ids.push(clientId));

    const clientInput1: ClientInput = {
      id: clientIds[0],
      firstName: "Ryan",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const clientInput2: ClientInput = {
      id: clientIds[1],
      firstName: "Chou",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const clientInput3: ClientInput = {
      id: clientIds[2],
      firstName: "Matty",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const { mutate } = createTestClient(apolloServer);
    await mutate({
      mutation: GQL_UPSERT_CLIENT,
      variables: {
        clientInput: clientInput1
      }
    });
    await mutate({
      mutation: GQL_UPSERT_CLIENT,
      variables: {
        clientInput: clientInput2
      }
    });
    await mutate({
      mutation: GQL_UPSERT_CLIENT,
      variables: {
        clientInput: clientInput3
      }
    });

    const response = await mutate({
      mutation: GQL_GET_CLIENTS
    });

    const getClients: GetClients_getClients[] = response.data?.getClients;

    expect(getClients.find((client) => client.id === clientInput1.id)).toEqual({
      ...clientInput1,
      lastName: null,
      address: null,
      contactEmail: null,
      contactNumber: null,
      notes: null
    });
    expect(getClients.find((client) => client.id === clientInput2.id)).toEqual({
      ...clientInput2,
      lastName: null,
      address: null,
      contactEmail: null,
      contactNumber: null,
      notes: null
    });
    expect(getClients.find((client) => client.id === clientInput3.id)).toEqual({
      ...clientInput3,
      lastName: null,
      address: null,
      contactEmail: null,
      contactNumber: null,
      notes: null
    });
  });
});
