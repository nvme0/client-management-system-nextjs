import { useMutation as m, MutationOptions } from "react-query";
import { RequestDocument } from "graphql-request/dist/types";
import { useOutbox } from "..";

export const useMutation = <T = any, V = undefined, E = Error, S = unknown>(
  query: RequestDocument,
  mutationOptions?: MutationOptions<T, V, E, S>
) => {
  const { fetcher } = useOutbox();
  return m((variables) => fetcher.enqueue(query, variables), mutationOptions);
};
