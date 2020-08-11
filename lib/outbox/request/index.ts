import { GraphQLClient } from "graphql-request";
import { Variables, RequestDocument } from "graphql-request/dist/types";

const getGraphQLClient = () =>
  new GraphQLClient(
    process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3000/api/graphql",
    {
      credentials: "same-origin"
    }
  );

export const request = async <T = any, V = Variables>(
  query: RequestDocument,
  variables?: V
) => getGraphQLClient().request<T>(query, variables);
