import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import Register from "pages/register";
import { OnlineStateProvider } from "lib/network";
import { OutboxProvider } from "lib/outbox";
import { LoggedInStateProvider } from "lib/loggedInState";

describe("Register Page", () => {
  afterEach(cleanup);

  it("renders", () => {
    const { asFragment } = render(
      <OnlineStateProvider>
        <LoggedInStateProvider>
          <OutboxProvider>
            <Register />
          </OutboxProvider>
        </LoggedInStateProvider>
      </OnlineStateProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
