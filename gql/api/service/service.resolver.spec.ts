import { v4 as uuid } from "uuid";
import { ApolloServer } from "apollo-server-micro";
import { createTestClient } from "apollo-server-testing";

import { deleteService } from "test-utils/cleanDB";
import { getApolloTestServer } from "test-utils/getApolloTestServer";
import {
  GQL_UPSERT_SERVICE,
  GQL_DELETE_SERVICE,
  GQL_GET_SERVICES
} from "gql/Service";
import { ServiceInput } from "gql/__generated__/globalTypes";
import { GetServices_getServices } from "gql/__generated__/GetServices";

describe("Service Resolver", () => {
  let apolloServer: ApolloServer;
  const ids: string[] = [];

  beforeAll(async () => {
    apolloServer = await getApolloTestServer();
  });

  afterAll(async () => {
    ids.forEach((id) => deleteService(id));
  });

  it("creates a new Service", async () => {
    const serviceId = uuid();
    ids.push(serviceId);

    const serviceInput: ServiceInput = {
      id: serviceId,
      name: "My Service 3",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const { mutate } = createTestClient(apolloServer);
    const response = await mutate({
      mutation: GQL_UPSERT_SERVICE,
      variables: {
        serviceInput
      }
    });

    expect(response).toMatchObject({
      data: {
        upsertService: {
          ...serviceInput,
          duration: null,
          expires: null,
          notes: null
        }
      }
    });
  });

  it("updates a Service", async () => {
    const serviceId = uuid();
    ids.push(serviceId);

    const serviceInput1: ServiceInput = {
      id: serviceId,
      name: "My Awesome Service 1",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const serviceInput2: ServiceInput = {
      id: serviceId,
      name: "My Awesome Service 2",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const { mutate } = createTestClient(apolloServer);
    await mutate({
      mutation: GQL_UPSERT_SERVICE,
      variables: {
        serviceInput: serviceInput1
      }
    });

    const response = await mutate({
      mutation: GQL_UPSERT_SERVICE,
      variables: {
        serviceInput: serviceInput2
      }
    });

    expect(response).toMatchObject({
      data: {
        upsertService: {
          ...serviceInput2,
          duration: null,
          expires: null,
          notes: null
        }
      }
    });
  });

  it("does not update a Service", async () => {
    const serviceId = uuid();
    ids.push(serviceId);

    const serviceInput1: ServiceInput = {
      id: serviceId,
      name: "My Awesome Service 1",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const serviceInput2: ServiceInput = {
      id: serviceId,
      name: "My Awesome Service 2",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:17.819Z"
    };

    const { mutate } = createTestClient(apolloServer);
    await mutate({
      mutation: GQL_UPSERT_SERVICE,
      variables: {
        serviceInput: serviceInput1
      }
    });

    const response = await mutate({
      mutation: GQL_UPSERT_SERVICE,
      variables: {
        serviceInput: serviceInput2
      }
    });

    expect(response).toMatchObject({
      data: {
        upsertService: {
          ...serviceInput1,
          duration: null,
          expires: null,
          notes: null
        }
      }
    });
  });

  it("deletes a Service", async () => {
    const serviceInput: ServiceInput = {
      id: uuid(),
      name: "My Awesome Service 1",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const { mutate } = createTestClient(apolloServer);
    await mutate({
      mutation: GQL_UPSERT_SERVICE,
      variables: {
        serviceInput: serviceInput
      }
    });

    const response = await mutate({
      mutation: GQL_DELETE_SERVICE,
      variables: {
        id: serviceInput.id,
        deletedAt: new Date()
      }
    });

    expect(response).toMatchObject({
      data: {
        deleteService: true
      }
    });
  });

  it("does not delete a Service", async () => {
    const serviceId = uuid();
    ids.push(serviceId);

    const serviceInput: ServiceInput = {
      id: serviceId,
      name: "My Awesome Service 1",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const { mutate } = createTestClient(apolloServer);
    await mutate({
      mutation: GQL_UPSERT_SERVICE,
      variables: {
        serviceInput: serviceInput
      }
    });

    const response = await mutate({
      mutation: GQL_DELETE_SERVICE,
      variables: {
        id: serviceInput.id,
        deletedAt: "2020-08-15T15:09:17.819Z"
      }
    });

    expect(response).toMatchObject({
      data: {
        deleteService: false
      }
    });
  });

  it("lists all services", async () => {
    const serviceIds = [uuid(), uuid(), uuid()];
    serviceIds.forEach((serviceId) => ids.push(serviceId));

    const serviceInput1: ServiceInput = {
      id: serviceIds[0],
      name: "My Awesome Service 1",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const serviceInput2: ServiceInput = {
      id: serviceIds[1],
      name: "My Awesome Service 2",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const serviceInput3: ServiceInput = {
      id: serviceIds[2],
      name: "My Awesome Service 3",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const { mutate } = createTestClient(apolloServer);
    await mutate({
      mutation: GQL_UPSERT_SERVICE,
      variables: {
        serviceInput: serviceInput1
      }
    });
    await mutate({
      mutation: GQL_UPSERT_SERVICE,
      variables: {
        serviceInput: serviceInput2
      }
    });
    await mutate({
      mutation: GQL_UPSERT_SERVICE,
      variables: {
        serviceInput: serviceInput3
      }
    });

    const response = await mutate({
      mutation: GQL_GET_SERVICES
    });

    const getServices: GetServices_getServices[] = response.data?.getServices;

    expect(
      getServices.find((service) => service.id === serviceInput1.id)
    ).toEqual({
      ...serviceInput1,
      duration: null,
      expires: null,
      notes: null
    });
    expect(
      getServices.find((service) => service.id === serviceInput2.id)
    ).toEqual({
      ...serviceInput2,
      duration: null,
      expires: null,
      notes: null
    });
    expect(
      getServices.find((service) => service.id === serviceInput3.id)
    ).toEqual({
      ...serviceInput3,
      duration: null,
      expires: null,
      notes: null
    });
  });
});
