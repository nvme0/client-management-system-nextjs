import { openDB, DBSchema } from "idb";
import { RequestDocument, Variables } from "graphql-request/dist/types";

enum Store {
  OUTBOX = "outbox",
  QUEUE = "queue"
}

export interface QueueItem<T = any, V = Variables> {
  query: RequestDocument;
  variables?: V;
  resolve: (value?: T) => void;
  reject: (reason?: any) => void;
}

export type Queue = QueueItem[];

export interface OutboxDBSchema extends DBSchema {
  outbox: {
    key: string;
    value: Queue;
  };
}

export const getStore = async () => ({
  db: await openDB<OutboxDBSchema>(Store.OUTBOX, 1, {
    upgrade(_db) {
      _db.createObjectStore(Store.OUTBOX, {
        autoIncrement: true,
        keyPath: "id"
      });
    }
  }),
  async push(item: QueueItem) {
    return (await this.getQueue()).push(item);
  },
  async unshift(item: QueueItem) {
    return (await this.getQueue()).unshift(item);
  },
  async shift() {
    return (await this.getQueue()).shift();
  },
  async peek() {
    const queue = await this.getQueue();
    return queue && queue.length > 0 ? queue[0] : undefined;
  },
  async clear() {
    await this.getQueue();
    this.db.put(Store.OUTBOX, [], Store.QUEUE);
  },
  async length() {
    const queue = await this.getQueue();
    return queue ? queue.length : -1;
  },
  async getQueue() {
    const queue = await this.db.get(Store.OUTBOX, Store.QUEUE);
    if (!queue) {
      await this.db.put(Store.OUTBOX, [], Store.QUEUE);
      return [];
    }
    return queue;
  }
});
