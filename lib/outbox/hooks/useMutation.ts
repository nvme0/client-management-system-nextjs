import { useMutation as m, MutationConfig } from "react-query";
import { RequestDocument } from "graphql-request/dist/types";
import { useOutbox } from "..";

export const useMutation = <T = any, V = undefined, E = Error, S = unknown>(
  query: RequestDocument,
  mutationOptions?: MutationConfig<T, E, V, S>
) => {
  const { fetcher } = useOutbox();
  return m((variables) => fetcher.enqueue(query, variables), mutationOptions);
};
