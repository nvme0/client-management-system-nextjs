import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import preloadAll from "jest-next-dynamic";

import Progress, { Props } from ".";

describe("Progress on Clients Page", () => {
  beforeAll(async () => {
    await preloadAll();
  });

  afterEach(cleanup);

  let props: Props;

  beforeEach(() => {
    props = {
      clients: [],
      upsertClient: jest.fn()
    };
  });

  it("renders", () => {
    const { asFragment } = render(<Progress {...{ ...props }} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
