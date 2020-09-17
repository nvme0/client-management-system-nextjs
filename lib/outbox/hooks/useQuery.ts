// import { isEqual } from "lodash";
import { useEffect } from "react";
import { useQuery as q, QueryConfig } from "react-query";
import { Variables, RequestDocument } from "graphql-request/dist/types";
// import { useOutbox } from "..";
import { request } from "../fetcher";

const useGqlQuery = <T = any, V = Variables, E = Error>(
  key: string,
  query: RequestDocument,
  variables?: V,
  queryOptions?: QueryConfig<T, E>
) => {
  // const { fetcher } = useOutbox();
  // return q<T, E>(key, () => fetcher.enqueue(query, variables), queryOptions);
  return q<T, E>(key, () => request<any, V>(query, variables), queryOptions);
};

export const useQuery = <T = any, V = Variables, E = Error>(
  key: string,
  query: RequestDocument,
  variables?: V,
  queryOptions?: QueryConfig<T, E>
) => {
  const { initialData: _initialData, ...rest } = queryOptions || {
    initialData: undefined
  };

  const initialData = (() => {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data) as T;
      }
    } catch (e) {}
    return _initialData as T;
  })();

  const queryResult = useGqlQuery(key, query, variables, {
    ...rest
  });

  useEffect(() => {
    if (queryResult.data != undefined) {
      localStorage.setItem(key, JSON.stringify(queryResult.data));
    }
  }, [key, queryResult.data]);

  return {
    ...queryResult,
    data: queryResult.data || initialData
  };
};
