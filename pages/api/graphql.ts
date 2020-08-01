import "reflect-metadata";
import { ApolloServer } from "apollo-server-micro";
import { buildSchema, Resolver, Query } from "type-graphql";
import { NextApiRequest, NextApiResponse } from "next";

let apolloServerHandler: (req: any, res: any) => Promise<void>;

export const config = { api: { bodyParser: false } };

@Resolver()
export class HelloResolver {
  @Query(() => String!)
  async hello() {
    return "Hello!";
  }
}

const getApolloServerHandler = async () => {
  if (!apolloServerHandler) {
    const schema = await buildSchema({
      resolvers: [HelloResolver]
    });
    apolloServerHandler = new ApolloServer({ schema }).createHandler({
      path: "/api/graphql"
    });
  }
  return apolloServerHandler;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const apolloServerHandler = await getApolloServerHandler();
  return apolloServerHandler(req, res);
};
