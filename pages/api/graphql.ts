import "reflect-metadata";
import { NextApiRequest, NextApiResponse } from "next";
import { buildSchema, BuildSchemaOptions } from "type-graphql";
import { ApolloServer } from "apollo-server-micro";
import { PrismaClient } from "@prisma/client";

import { ServiceResolver } from "gql/api/service/service.resolver";
import { AuthResolver } from "gql/api/auth/auth.resolver";
import { configuration, validationSchema } from "lib/config";
import { UserResolver } from "gql/api/user/user.resolver";

let apolloServerHandler: (req: any, res: any) => Promise<void>;

export const config = { api: { bodyParser: false } };

export const createSchema = (options?: Omit<BuildSchemaOptions, "resolvers">) =>
  buildSchema({
    resolvers: [AuthResolver, UserResolver, ServiceResolver],
    ...options
  });

const getApolloServerHandler = async () => {
  if (!apolloServerHandler) {
    const schema = await createSchema({
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
      debug: isDevelopment,
      context: ({ req, res, connection }) => {
        return {
          req,
          res,
          prisma: new PrismaClient({ log: ["query"] })
        };
      }
    }).createHandler({
      path: "/api/graphql"
    });
  }
  return apolloServerHandler;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  validationSchema.isValid(configuration).then((isValid) => {
    if (!isValid) throw new Error(".env file is not valid");
  });
  const apolloServerHandler = await getApolloServerHandler();
  return apolloServerHandler(req, res);
};
