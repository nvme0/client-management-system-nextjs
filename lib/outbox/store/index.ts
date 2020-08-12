import localForage from "localforage";
import { RequestDocument, Variables } from "graphql-request/dist/types";
import { Await } from "..";

enum Config {
  NAME = "iwdcms",
  STORENAME = "outbox",
  KEY = "queue",
  VERSION = 1
}

const config: LocalForageOptions = {
  name: Config.NAME as string,
  storeName: Config.STORENAME as string,
  version: Config.VERSION as number,
  description: "Outbox queue",
  driver: localForage.LOCALSTORAGE // Force localStorage until FF private browsing supports indexedDB
};

export interface QueueItem<T = any, V = Variables> {
  id: string;
  query: RequestDocument;
  variables?: V;
}

export type Queue = QueueItem[];

export const getStore = () => ({
  store: localForage.createInstance(config),
  async push(item: QueueItem) {
    const queue = await this.getQueue();
    queue.push(item);
    return this.store.setItem(Config.KEY, queue);
  },
  async unshift(item: QueueItem) {
    const queue = await this.getQueue();
    queue.unshift(item);
    return this.store.setItem(Config.KEY, queue);
  },
  async shift() {
    const queue = await this.getQueue();
    const item = queue.shift();
    this.store.setItem(Config.KEY, queue);
    return item;
  },
  async peek() {
    const queue = await this.getQueue();
    return queue && queue.length > 0 ? queue[0] : undefined;
  },
  async clear() {
    this.store.setItem<Queue>(Config.KEY, []);
  },
  async length() {
    const queue = await this.getQueue();
    return queue ? queue.length : -1;
  },
  async getQueue() {
    const queue = await this.store.getItem<Queue>(Config.KEY);
    if (!queue) {
      await this.store.setItem<Queue>(Config.KEY, []);
      return [];
    }
    return queue;
  }
});

export type Store = Await<ReturnType<typeof getStore>>;
