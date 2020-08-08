import { ApolloClient, InMemoryCache } from "@apollo/client";
import localForage from "localforage";
import {} from "@apollo/client/link/schema";

let apolloClient;

const createIsomorphLink = (ssrMode: Boolean) => {
  if (ssrMode) {
    // const { SchemaLink } = require("@apollo/client/link/schema");
    // const { schema } = require("./schema");
    // return new SchemaLink({ schema });
  } else {
    const { HttpLink } = require("@apollo/client/link/http");
    return new HttpLink({
      uri: "http://localhost:3000/api/graphql",
      credentials: "same-origin"
    });
  }
};

const createApolloClient = async () => {
  const ssrMode = typeof window === "undefined";
  const cache = new InMemoryCache();

  const client = new ApolloClient({
    ssrMode,
    link: createIsomorphLink(ssrMode),
    cache
  });

  // only persist cache on client
  if (!ssrMode) {
    try {
      const { persistCache } = await import("apollo-cache-persist-dev");
      await persistCache({
        cache,
        storage: localForage
      });
    } catch (error) {
      console.error("Error restoring Apollo cache", error);
    }
  }

  return client;
};

export const initializeApollo = async (initialState = null) => {
  const _apolloClient = apolloClient ?? (await createApolloClient());

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};

export const useApollo = (initialState) => {
  const store = initializeApollo(initialState);
  return store;
};
