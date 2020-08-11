import { createContext, useEffect, useContext } from "react";
import {
  useQuery as q,
  QueryOptions,
  useMutation as m,
  MutationOptions
} from "react-query";
import { RequestDocument, Variables } from "graphql-request/dist/types";
import { getFetcher } from "./fetcher";

export { fallback } from "./fallback";

export const OutboxContext = createContext<{
  useQuery: Outbox["useQuery"];
  useMutation: Outbox["useMutation"];
}>(undefined!);

export const useOutbox = () => useContext(OutboxContext);

export const getOutbox = async () => ({
  fetcher: await getFetcher(),

  useMutation<T = any, V = undefined, E = Error, S = unknown>(
    query: RequestDocument,
    mutationOptions?: MutationOptions<T, V, E, S>
  ) {
    return m(
      (variables) => this.fetcher.enqueue(query, variables),
      mutationOptions
    );
  },

  useGqlQuery<T = any, V = Variables, E = Error>(
    query: RequestDocument,
    variables?: V,
    queryOptions?: QueryOptions<T, E>
  ) {
    return q(
      [query],
      () => this.fetcher.enqueue(query, variables),
      queryOptions
    );
  },

  useQuery<T = any, V = Variables, E = Error>(
    key: string,
    query: RequestDocument,
    variables?: V,
    queryOptions?: QueryOptions<T, E>
  ) {
    const queryResult = this.useGqlQuery(query, variables, {
      ...queryOptions,
      initialData: () => {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            return JSON.parse(data);
          }
        } catch (e) {}
        return queryOptions?.initialData;
      }
    });

    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(queryResult.data));
    }, [key, queryResult.data]);

    return queryResult;
  }
});

type Await<T> = T extends {
  then(onfulfilled?: (value: infer U) => unknown): unknown;
}
  ? U
  : T;

export type Outbox = Await<ReturnType<typeof getOutbox>>;
