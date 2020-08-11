export type NetworkCallback = (result: boolean) => void;

const handle = (callback: NetworkCallback, isOnline: boolean) => {
  if (window.requestAnimationFrame) {
    window.requestAnimationFrame(() => callback(isOnline));
  } else {
    setTimeout(() => callback(isOnline), 0);
  }
};

export const detectNetwork = (callback: NetworkCallback) => {
  if (typeof window !== "undefined" && window.addEventListener) {
    window.addEventListener("online", () => handle(callback, true));
    window.addEventListener("offline", () => handle(callback, false));
    handle(callback, window.navigator.onLine);
  }
};
