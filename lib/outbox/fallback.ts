import {
  useQuery as q,
  QueryOptions,
  useMutation as m,
  MutationOptions
} from "react-query";
import { RequestDocument, Variables } from "graphql-request/dist/types";
import { request } from "./fetcher";

export const fallback = {
  useMutation<T = any, V = undefined, E = Error, S = unknown>(
    query: RequestDocument,
    mutationOptions?: MutationOptions<T, V, E, S>
  ) {
    return m((variables) => request(query, variables), mutationOptions);
  },
  useQuery<T = any, V = Variables, E = Error>(
    query: RequestDocument,
    variables?: V,
    queryOptions?: QueryOptions<T, E>
  ) {
    return q([query], () => request(query, variables), queryOptions);
  }
};
