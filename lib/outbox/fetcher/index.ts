import { GraphQLClient } from "graphql-request";
import { Variables, RequestDocument } from "graphql-request/dist/types";
import { getStore } from "../store";

const getGraphQLClient = () =>
  new GraphQLClient(
    process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3000/api/graphql",
    {
      credentials: "same-origin"
    }
  );

export const request = async <T = any, V = Variables>(
  query: RequestDocument,
  variables?: V
) => getGraphQLClient().request<T>(query, variables);

export const getFetcher = async () => ({
  ready: true,
  store: await getStore(),

  enqueue<T = any, V = Variables>(query: RequestDocument, variables?: V) {
    return new Promise<T>((resolve, reject) => {
      this.store.push({
        query,
        variables,
        resolve,
        reject
      });
      this.dequeue();
    });
  },

  async dequeue() {
    if (!this.ready || !navigator.onLine) {
      return false;
    }
    const item = await this.store.shift();
    if (!item) {
      return false;
    }
    const { query, variables, reject, resolve } = item;
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
