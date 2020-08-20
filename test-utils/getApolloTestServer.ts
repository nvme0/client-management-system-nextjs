import { ApolloServer } from "apollo-server-micro";

import { createSchema } from "pages/api/graphql";
import { getPrismaTestClient } from "./getPrismaTestClient";

export const getApolloTestServer = async () => {
  const schema = await createSchema();
  return new ApolloServer({
    schema,
    debug: true,
    context: ({ req, res, connection }) => {
      return {
        prisma: getPrismaTestClient()
      };
    }
  });
};
