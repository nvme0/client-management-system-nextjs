import { queryCache, QueryKey } from "react-query";

export const optimisticUpsert = <
  D extends { id: string },
  R = { [key: string]: [] }
>(
  key: QueryKey,
  input: D,
  objectName: string,
  __typename: string
) => {
  queryCache.cancelQueries(key);
  const previousValue = queryCache.getQueryData<R>(key);

  queryCache.setQueryData<any>(key, (old: R) => {
    if (old) {
      const index = old[objectName].findIndex(
        (entry: D) => entry.id === input.id
      );
      if (index > -1) {
        return {
          [objectName]: (old[objectName] as D[]).map((entry) =>
            entry.id === input.id ? { ...input, __typename } : entry
          )
        };
      }
    }
    return {
      [objectName]: [...(old?.[objectName] || []), { ...input, __typename }]
    };
  });
  return () =>
    queryCache.setQueryData(key, previousValue || { [objectName]: [] });
};

export const optimisticDelete = <
  D extends { id: string },
  R = { [key: string]: [] }
>(
  key: QueryKey,
  id: string,
  objectName: string
) => {
  queryCache.cancelQueries(key);
  const previousValue = queryCache.getQueryData<R>(key);

  queryCache.setQueryData<any>(key, (old: R) => ({
    [objectName]: old?.[objectName].filter((entry: D) => entry.id !== id) || []
  }));

  return () =>
    queryCache.setQueryData(key, previousValue || { [objectName]: [] });
};
