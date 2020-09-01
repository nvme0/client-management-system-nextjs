import { v4 as uuid } from "uuid";
import { ApolloServer } from "apollo-server-micro";
import { createTestClient } from "apollo-server-testing";
import { sign } from "jsonwebtoken";
import { PrismaClient, PrismaClientOptions } from "@prisma/client";

import { deleteProgram } from "test-utils/cleanDB";
import { createApolloTestServer } from "test-utils/createApolloTestServer";
import {
  GQL_UPSERT_PROGRAM,
  GQL_DELETE_PROGRAM,
  GQL_GET_PROGRAMS
} from "gql/Program";
import { ProgramInput } from "gql/__generated__/globalTypes";
import { GetPrograms_getPrograms } from "gql/__generated__/GetPrograms";
import { configuration } from "lib/config";
import { createPrismaTestClient } from "test-utils/createPrismaTestClient";
import { createTestUser } from "test-utils/createTestUser";
import { User } from "../user/models/user.model";

describe("Program Resolver", () => {
  let apolloServer: ApolloServer;
  const ids: string[] = [];
  let prisma: PrismaClient<PrismaClientOptions, never>;
  let user: User;

  beforeAll(async () => {
    prisma = createPrismaTestClient();
    const userId = uuid();
    user = await createTestUser(prisma, userId, {
      firstName: "program",
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
    ids.forEach((id) => deleteProgram(id));
    await prisma.user.delete({ where: { id: user.id } });
    prisma.$disconnect();
  });

  it("creates a new Program", async () => {
    const programId = uuid();
    ids.push(programId);

    const programInput: ProgramInput = {
      id: programId,
      name: "My Program 3",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const { mutate } = createTestClient(apolloServer);
    const response = await mutate({
      mutation: GQL_UPSERT_PROGRAM,
      variables: {
        programInput
      }
    });

    expect(response).toMatchObject({
      data: {
        upsertProgram: {
          ...programInput,
          notes: null
        }
      }
    });
  });

  it("updates a Program", async () => {
    const programId = uuid();
    ids.push(programId);

    const programInput1: ProgramInput = {
      id: programId,
      name: "My Awesome Program 1",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const programInput2: ProgramInput = {
      id: programId,
      name: "My Awesome Program 2",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const { mutate } = createTestClient(apolloServer);
    await mutate({
      mutation: GQL_UPSERT_PROGRAM,
      variables: {
        programInput: programInput1
      }
    });

    const response = await mutate({
      mutation: GQL_UPSERT_PROGRAM,
      variables: {
        programInput: programInput2
      }
    });

    expect(response).toMatchObject({
      data: {
        upsertProgram: {
          ...programInput2,
          notes: null
        }
      }
    });
  });

  it("does not update a Program", async () => {
    const programId = uuid();
    ids.push(programId);

    const programInput1: ProgramInput = {
      id: programId,
      name: "My Awesome Program 1",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const programInput2: ProgramInput = {
      id: programId,
      name: "My Awesome Program 2",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:17.819Z"
    };

    const { mutate } = createTestClient(apolloServer);
    await mutate({
      mutation: GQL_UPSERT_PROGRAM,
      variables: {
        programInput: programInput1
      }
    });

    const response = await mutate({
      mutation: GQL_UPSERT_PROGRAM,
      variables: {
        programInput: programInput2
      }
    });

    expect(response).toMatchObject({
      data: {
        upsertProgram: {
          ...programInput1,
          notes: null
        }
      }
    });
  });

  it("deletes a Program", async () => {
    const programInput: ProgramInput = {
      id: uuid(),
      name: "My Awesome Program 1",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const { mutate } = createTestClient(apolloServer);
    await mutate({
      mutation: GQL_UPSERT_PROGRAM,
      variables: {
        programInput: programInput
      }
    });

    const response = await mutate({
      mutation: GQL_DELETE_PROGRAM,
      variables: {
        id: programInput.id,
        deletedAt: new Date()
      }
    });

    expect(response).toMatchObject({
      data: {
        deleteProgram: true
      }
    });
  });

  it("does not delete a Program", async () => {
    const programId = uuid();
    ids.push(programId);

    const programInput: ProgramInput = {
      id: programId,
      name: "My Awesome Program 1",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const { mutate } = createTestClient(apolloServer);
    await mutate({
      mutation: GQL_UPSERT_PROGRAM,
      variables: {
        programInput: programInput
      }
    });

    const response = await mutate({
      mutation: GQL_DELETE_PROGRAM,
      variables: {
        id: programInput.id,
        deletedAt: "2020-08-15T15:09:17.819Z"
      }
    });

    expect(response).toMatchObject({
      data: {
        deleteProgram: false
      }
    });
  });

  it("lists all programs", async () => {
    const programIds = [uuid(), uuid(), uuid()];
    programIds.forEach((programId) => ids.push(programId));

    const programInput1: ProgramInput = {
      id: programIds[0],
      name: "My Awesome Program 1",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const programInput2: ProgramInput = {
      id: programIds[1],
      name: "My Awesome Program 2",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const programInput3: ProgramInput = {
      id: programIds[2],
      name: "My Awesome Program 3",
      createdAt: "2020-08-15T15:09:17.819Z",
      updatedAt: "2020-08-15T15:09:18.819Z"
    };

    const { mutate } = createTestClient(apolloServer);
    await mutate({
      mutation: GQL_UPSERT_PROGRAM,
      variables: {
        programInput: programInput1
      }
    });
    await mutate({
      mutation: GQL_UPSERT_PROGRAM,
      variables: {
        programInput: programInput2
      }
    });
    await mutate({
      mutation: GQL_UPSERT_PROGRAM,
      variables: {
        programInput: programInput3
      }
    });

    const response = await mutate({
      mutation: GQL_GET_PROGRAMS
    });

    const getPrograms: GetPrograms_getPrograms[] = response.data?.getPrograms;

    expect(
      getPrograms.find((program) => program.id === programInput1.id)
    ).toEqual({
      ...programInput1,
      notes: null
    });
    expect(
      getPrograms.find((program) => program.id === programInput2.id)
    ).toEqual({
      ...programInput2,
      notes: null
    });
    expect(
      getPrograms.find((program) => program.id === programInput3.id)
    ).toEqual({
      ...programInput3,
      notes: null
    });
  });
});
