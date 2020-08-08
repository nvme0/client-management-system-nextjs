import "reflect-metadata";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-micro";

import { HelloResolver } from "./hello/hello.resolver";

let apolloServerHandler: (req: any, res: any) => Promise<void>;

export const config = { api: { bodyParser: false } };

const getApolloServerHandler = async () => {
  if (!apolloServerHandler) {
    const schema = await buildSchema({
      resolvers: [HelloResolver],
      emitSchemaFile: process.cwd() + "/schema.gql"
    });

    const isDevelopment = process.env.NODE_ENV === "development";
    apolloServerHandler = new ApolloServer({
      schema,
      playground: isDevelopment
        ? {
            settings: {
              "request.credentials": "include"
            }
          }
        : false,
      debug: isDevelopment
    }).createHandler({
      path: "/api/graphql"
    });
  }
  return apolloServerHandler;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const apolloServerHandler = await getApolloServerHandler();
  return apolloServerHandler(req, res);
};
