import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import Login from ".";
import { OnlineStateProvider } from "lib/network";
import { OutboxProvider } from "lib/outbox";
import { LoggedInStateProvider } from "lib/loggedInState";

describe("Login Page", () => {
  afterEach(cleanup);

  it("renders", () => {
    const { asFragment } = render(
      <OnlineStateProvider>
        <LoggedInStateProvider>
          <OutboxProvider>
            <Login />
          </OutboxProvider>
        </LoggedInStateProvider>
      </OnlineStateProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
