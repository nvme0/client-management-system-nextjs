import { GraphQLClient } from "graphql-request";
import { Variables, RequestDocument } from "graphql-request/dist/types";
import { v4 as uuid } from "uuid";
import { getStore } from "../store";
import { Await } from "..";
import { getAccessToken, setAccessToken } from "lib/accessToken";
import { setIsLoggedIn, getIsLoggedIn } from "lib/loggedInState";

const resolverNoop = (value?: any) => {};

export interface Resolver {
  resolve: typeof resolverNoop;
  reject: typeof resolverNoop;
}

export interface Resolvers {
  [id: string]: Resolver;
}

const getGraphQLClient = () =>
  new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_URL!, {
    credentials: "same-origin"
  });

export const request = async <T = any, V = Variables>(
  query: RequestDocument,
  variables?: V
) => {
  const client = getGraphQLClient();
  client.setHeader("authorization", `Bearer ${getAccessToken()}`);

  const { data, headers } = await client.rawRequest<T>(
    query as string,
    variables
  );

  const accessToken = headers.get("x-access-token");
  if (accessToken) {
    setAccessToken(accessToken);
  }
  return data;
};

export const getFetcher = () => ({
  ready: true,
  store: getStore(),
  resolvers: {} as Resolvers,

  enqueue<T = any, V = Variables>(query: RequestDocument, variables?: V) {
    if (this.store) {
      return new Promise<T>((resolve, reject) => {
        const id = uuid();
        // store resolvers in memory
        this.resolvers[id] = {
          resolve,
          reject
        };
        // store query & variables in offline store
        this.store
          .push({
            id,
            query,
            variables
          })
          .then(() => {
            this.dequeue();
          })
          .catch((e) => {
            console.error(e);
            reject();
            delete this.resolvers[id];
          });
      });
    } else {
      return request(query, variables);
    }
  },

  async dequeue() {
    if (!this.ready || !navigator.onLine) {
      return false;
    }
    const item = await this.store.shift();
    if (!item) {
      return false;
    }
    const { id, query, variables } = item;
    const resolve = this.resolvers[id]?.resolve || resolverNoop;
    const reject = this.resolvers[id]?.reject || resolverNoop;

    try {
      this.ready = false;
      request(query, variables)
        .then((response) => {
          resolve(response);
          delete this.resolvers[id];
          this.ready = true;
          this.dequeue();
        })
        .catch((error) => {
          this.ready = true;

          if (error.response) {
            // server is unreachable
            if (error.response.status === 502) {
              this.store.unshift(item);
              return;
            }

            if (error.response.errors) {
              error.response.errors.forEach((error) => {
                // user is not logged in
                if (error.message === "Unauthorized") {
                  setIsLoggedIn(false);
                  this.store.unshift(item);
                  return;
                }
              });
            }
          }

          // don't reject promise if user is not logged in
          if (getIsLoggedIn() === true) {
            reject(error);
            delete this.resolvers[id];
            this.dequeue();
          }
        });
    } catch (error) {
      reject(error);
      delete this.resolvers[id];
      this.ready = true;
      this.dequeue();
    }
    return true;
  }
});

export type Fetcher = Await<ReturnType<typeof getFetcher>>;
