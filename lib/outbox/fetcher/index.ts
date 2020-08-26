import { GraphQLClient } from "graphql-request";
import { Variables, RequestDocument } from "graphql-request/dist/types";
import { v4 as uuid } from "uuid";
import { getStore } from "../store";
import { Await } from "..";

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
) => getGraphQLClient().request<T>(query, variables);

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
            delete this.resolvers[id];
            console.error(e);
            reject();
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
          this.ready = true;
          resolve(response);
          this.dequeue();
        })
        .catch((error) => {
          // TODO - handle cases, some warrant a retry
          this.ready = true;

          if (error.response && error.response.status) {
            const response: Response = error.response;
            switch (response.status) {
              case 502:
                this.store.unshift(item);
                return;

              default:
                break;
            }
          }

          reject(error);
          this.dequeue();
        });
    } catch (error) {
      this.ready = true;
      reject(error);
      this.dequeue();
    }
    return true;
  }
});

export type Fetcher = Await<ReturnType<typeof getFetcher>>;
