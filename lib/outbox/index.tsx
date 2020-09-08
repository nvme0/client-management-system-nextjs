import { createContext, useContext, useEffect } from "react";

import { useOnlineState } from "lib/network";
import { getFetcher, Fetcher } from "./fetcher";
import { useLoggedInState } from "lib/loggedInState";

export { useQuery } from "./hooks/useQuery";
export { useMutation } from "./hooks/useMutation";

export const OutboxContext = createContext<{
  fetcher: Fetcher;
}>(undefined!);

export const useOutbox = () => useContext(OutboxContext);

export const OutboxProvider = ({ children }) => {
  const { isOnline } = useOnlineState();
  const { isLoggedIn } = useLoggedInState();

  const fetcher = getFetcher();

  useEffect(() => {
    if (isOnline && isLoggedIn) {
      fetcher?.dequeue();
    }
  }, [isOnline, isLoggedIn]);

  return (
    <OutboxContext.Provider {...{ value: { fetcher } }}>
      {children}
    </OutboxContext.Provider>
  );
};

export type Await<T> = T extends {
  then(onfulfilled?: (value: infer U) => unknown): unknown;
}
  ? U
  : T;
