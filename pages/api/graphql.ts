import "reflect-metadata";
import { NextApiRequest, NextApiResponse } from "next";
import { ApolloServer } from "apollo-server-micro";

import { AppModule } from "./app.module";

let apolloServerHandler: (req: any, res: any) => Promise<void>;

export const config = { api: { bodyParser: false } };

const { schema, context } = AppModule.forRoot({
  hello: {
    message: "Hello, World!"
  }
});

const getApolloServerHandler = async () => {
  if (!apolloServerHandler) {
    apolloServerHandler = new ApolloServer({
      introspection: true,
      schema,
      context
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
