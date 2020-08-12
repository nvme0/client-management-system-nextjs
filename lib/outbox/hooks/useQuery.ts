import { useEffect } from "react";
import { useQuery as q, QueryOptions } from "react-query";
import { Variables, RequestDocument } from "graphql-request/dist/types";
import { useOutbox } from "..";

const useGqlQuery = <T = any, V = Variables, E = Error>(
  query: RequestDocument,
  variables?: V,
  queryOptions?: QueryOptions<T, E>
) => {
  const { fetcher } = useOutbox();
  return q([query], () => fetcher.enqueue(query, variables), queryOptions);
};

export const useQuery = <T = any, V = Variables, E = Error>(
  key: string,
  query: RequestDocument,
  variables?: V,
  queryOptions?: QueryOptions<T, E>
) => {
  const queryResult = useGqlQuery(query, variables, {
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
};
