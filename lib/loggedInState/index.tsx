import { useState, useEffect, useContext, createContext } from "react";

let isLoggedIn = false;

const listeners = new Set<() => void>();

export const setIsLoggedIn = (value: boolean) => {
  isLoggedIn = value;
  listeners.forEach((listener) => listener());
};

export const getIsLoggedIn = () => {
  return isLoggedIn;
};

export const LoggedInStateContext = createContext<{
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}>(undefined!);

export const useLoggedInState = () => useContext(LoggedInStateContext);

export const LoggedInStateProvider = ({ children }) => {
  const [state, setState] = useState(isLoggedIn);
  useEffect(() => {
    const listener = () => setState(isLoggedIn);
    listeners.add(listener);
    listener();
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return (
    <LoggedInStateContext.Provider
      {...{ value: { isLoggedIn: state, setIsLoggedIn } }}
    >
      {children}
    </LoggedInStateContext.Provider>
  );
};

export const TestLoggedInStateProvider = ({ children }) => {
  const [state, setState] = useState(false);
  return (
    <LoggedInStateContext.Provider
      {...{ value: { isLoggedIn: state, setIsLoggedIn: setState } }}
    >
      {children}
    </LoggedInStateContext.Provider>
  );
};
