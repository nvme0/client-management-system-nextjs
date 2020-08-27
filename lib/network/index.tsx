import { createContext, useContext, useState } from "react";

export type NetworkCallback = (result: boolean) => void;

export const OnlineContext = createContext<{ isOnline: boolean }>(undefined!);

export const useOnlineState = () => useContext(OnlineContext);

export const OnlineStateProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(false);
  detectNetwork((_isOnline) => setIsOnline(_isOnline));
  return (
    <OnlineContext.Provider
      {...{
        value: {
          isOnline
        }
      }}
    >
      {children}
    </OnlineContext.Provider>
  );
};

export const detectNetwork = (callback: NetworkCallback) => {
  if (typeof window !== "undefined" && window.addEventListener) {
    window.addEventListener("online", () => handle(callback, true));
    window.addEventListener("offline", () => handle(callback, false));
    handle(callback, window.navigator.onLine);
  }
};

const handle = (callback: NetworkCallback, isOnline: boolean) => {
  if (window.requestAnimationFrame) {
    window.requestAnimationFrame(() => callback(isOnline));
  } else {
    setTimeout(() => callback(isOnline), 0);
  }
};
