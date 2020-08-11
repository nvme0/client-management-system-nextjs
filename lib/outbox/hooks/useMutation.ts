import { useMutation, MutationOptions } from "react-query";
import { RequestDocument } from "graphql-request/dist/types";
import { Queue } from "..";

export const useGqlMutation = <T = any, V = undefined, E = Error, S = unknown>(
  query: RequestDocument,
  mutationOptions?: MutationOptions<T, V, E, S>
) =>
  useMutation((variables) => Queue.enqueue(query, variables), mutationOptions);
