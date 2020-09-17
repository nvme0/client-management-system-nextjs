import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import preloadAll from "jest-next-dynamic";

import Clients from ".";
import { OnlineStateProvider } from "lib/network";
import { OutboxProvider } from "lib/outbox";
import { LoggedInStateProvider } from "lib/loggedInState";

describe("Clients Page", () => {
  beforeAll(async () => {
    await preloadAll();
  });

  afterEach(cleanup);

  it("renders", () => {
    const { asFragment } = render(
      <OnlineStateProvider>
        <LoggedInStateProvider>
          <OutboxProvider>
            <Clients />
          </OutboxProvider>
        </LoggedInStateProvider>
      </OnlineStateProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
