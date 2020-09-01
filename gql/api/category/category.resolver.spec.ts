import { v4 as uuid } from "uuid";
import { ApolloServer } from "apollo-server-micro";
import { createTestClient } from "apollo-server-testing";
import { sign } from "jsonwebtoken";
import { PrismaClient, PrismaClientOptions } from "@prisma/client";

import { deleteCategory } from "test-utils/cleanDB";
import { createApolloTestServer } from "test-utils/createApolloTestServer";
import {
  GQL_UPSERT_CATEGORY,
  GQL_DELETE_CATEGORY,
  GQL_GET_CATEGORIES
} from "gql/Category";
import { CategoryInput } from "gql/__generated__/globalTypes";
import { GetCategories_getCategories } from "gql/__generated__/GetCategories";
import { configuration } from "lib/config";
import { createPrismaTestClient } from "test-utils/createPrismaTestClient";
import { createTestUser } from "test-utils/createTestUser";
import { User } from "../user/models/user.model";

describe("Category Resolver", () => {
  let apolloServer: ApolloServer;
  const ids: string[] = [];
  let prisma: PrismaClient<PrismaClientOptions, never>;
  let user: User;

  beforeAll(async () => {
    prisma = createPrismaTestClient();
    const userId = uuid();
    user = await createTestUser(prisma, userId, {
      firstName: "category",
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
    ids.forEach((id) => deleteCategory(id));
    await prisma.user.delete({ where: { id: user.id } });
    prisma.$disconnect();
  });

  it("creates a new Category", async () => {
    const categoryId = uuid();
    ids.push(categoryId);

    const categoryInput: CategoryInput = {
      id: categoryId,
      name: "My Category 3",
      for: "Program",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const { mutate } = createTestClient(apolloServer);
    const response = await mutate({
      mutation: GQL_UPSERT_CATEGORY,
      variables: {
        categoryInput
      }
    });

    expect(response).toMatchObject({
      data: {
        upsertCategory: {
          ...categoryInput,
          for: "Program",
          notes: null
        }
      }
    });
  });

  it("updates a Category", async () => {
    const categoryId = uuid();
    ids.push(categoryId);

    const categoryInput1: CategoryInput = {
      id: categoryId,
      name: "My Awesome Category 1",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const categoryInput2: CategoryInput = {
      id: categoryId,
      name: "My Awesome Category 2",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const { mutate } = createTestClient(apolloServer);
    await mutate({
      mutation: GQL_UPSERT_CATEGORY,
      variables: {
        categoryInput: categoryInput1
      }
    });

    const response = await mutate({
      mutation: GQL_UPSERT_CATEGORY,
      variables: {
        categoryInput: categoryInput2
      }
    });

    expect(response).toMatchObject({
      data: {
        upsertCategory: {
          ...categoryInput2,
          for: "Program",
          notes: null
        }
      }
    });
  });

  it("does not update a Category", async () => {
    const categoryId = uuid();
    ids.push(categoryId);

    const categoryInput1: CategoryInput = {
      id: categoryId,
      name: "My Awesome Category 1",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const categoryInput2: CategoryInput = {
      id: categoryId,
      name: "My Awesome Category 2",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:17.819Z"
    };

    const { mutate } = createTestClient(apolloServer);
    await mutate({
      mutation: GQL_UPSERT_CATEGORY,
      variables: {
        categoryInput: categoryInput1
      }
    });

    const response = await mutate({
      mutation: GQL_UPSERT_CATEGORY,
      variables: {
        categoryInput: categoryInput2
      }
    });

    expect(response).toMatchObject({
      data: {
        upsertCategory: {
          ...categoryInput1,
          for: "Program",
          notes: null
        }
      }
    });
  });

  it("deletes a Category", async () => {
    const categoryInput: CategoryInput = {
      id: uuid(),
      name: "My Awesome Category 1",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const { mutate } = createTestClient(apolloServer);
    await mutate({
      mutation: GQL_UPSERT_CATEGORY,
      variables: {
        categoryInput: categoryInput
      }
    });

    const response = await mutate({
      mutation: GQL_DELETE_CATEGORY,
      variables: {
        id: categoryInput.id,
        deletedAt: new Date()
      }
    });

    expect(response).toMatchObject({
      data: {
        deleteCategory: true
      }
    });
  });

  it("does not delete a Category", async () => {
    const categoryId = uuid();
    ids.push(categoryId);

    const categoryInput: CategoryInput = {
      id: categoryId,
      name: "My Awesome Category 1",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const { mutate } = createTestClient(apolloServer);
    await mutate({
      mutation: GQL_UPSERT_CATEGORY,
      variables: {
        categoryInput: categoryInput
      }
    });

    const response = await mutate({
      mutation: GQL_DELETE_CATEGORY,
      variables: {
        id: categoryInput.id,
        deletedAt: "2020-08-15T15:09:17.819Z"
      }
    });

    expect(response).toMatchObject({
      data: {
        deleteCategory: false
      }
    });
  });

  it("lists all categories", async () => {
    const categoryIds = [uuid(), uuid(), uuid()];
    categoryIds.forEach((categoryId) => ids.push(categoryId));

    const categoryInput1: CategoryInput = {
      id: categoryIds[0],
      name: "My Awesome Category 1",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const categoryInput2: CategoryInput = {
      id: categoryIds[1],
      name: "My Awesome Category 2",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const categoryInput3: CategoryInput = {
      id: categoryIds[2],
      name: "My Awesome Category 3",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const { mutate } = createTestClient(apolloServer);
    await mutate({
      mutation: GQL_UPSERT_CATEGORY,
      variables: {
        categoryInput: categoryInput1
      }
    });
    await mutate({
      mutation: GQL_UPSERT_CATEGORY,
      variables: {
        categoryInput: categoryInput2
      }
    });
    await mutate({
      mutation: GQL_UPSERT_CATEGORY,
      variables: {
        categoryInput: categoryInput3
      }
    });

    const response = await mutate({
      mutation: GQL_GET_CATEGORIES
    });

    const getCategories: GetCategories_getCategories[] =
      response.data?.getCategories;

    expect(
      getCategories.find((category) => category.id === categoryInput1.id)
    ).toEqual({
      ...categoryInput1,
      for: "Program",
      notes: null
    });
    expect(
      getCategories.find((category) => category.id === categoryInput2.id)
    ).toEqual({
      ...categoryInput2,
      for: "Program",
      notes: null
    });
    expect(
      getCategories.find((category) => category.id === categoryInput3.id)
    ).toEqual({
      ...categoryInput3,
      for: "Program",
      notes: null
    });
  });
});
