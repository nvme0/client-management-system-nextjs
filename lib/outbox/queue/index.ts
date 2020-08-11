import { RequestDocument, Variables } from "graphql-request/dist/types";
import { request } from "../request";

export interface QueueItem<T = any, V = Variables> {
  query: RequestDocument;
  variables?: V;
  resolve: (value?: T) => void;
  reject: (reason?: any) => void;
}

export class Queue {
  private static queue: QueueItem[] = [];
  private static ready = true;

  static getQueueLength() {
    return this.queue.length;
  }

  static eraseQueue() {
    this.queue = [];
  }

  static enqueue<T = any, V = Variables>(
    query: RequestDocument,
    variables?: V
  ) {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        query,
        variables,
        resolve,
        reject
      });
      this.dequeue();
    });
  }

  static dequeue() {
    if (!this.ready || !navigator.onLine) {
      return false;
    }
    const item = this.queue.shift();
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
                this.queue.unshift(item);
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
}
