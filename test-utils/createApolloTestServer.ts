import { ApolloServer } from "apollo-server-micro";

import { createSchema } from "pages/api/graphql";
import { createPrismaTestClient } from "./createPrismaTestClient";

export const createApolloTestServer = async (headers = {} as any) => {
  const schema = await createSchema();
  const server = new ApolloServer({
    schema,
    debug: true,
    context: ({ req, res }) => {
      return {
        res,
        req: {
          ...req,
          headers
        },
        prisma: createPrismaTestClient()
      };
    }
  });
  return server;
};
