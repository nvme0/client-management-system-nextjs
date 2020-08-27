import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import LoginModal from ".";
import { TestLoggedInStateProvider } from "lib/loggedInState";

describe("Login Modal", () => {
  afterEach(cleanup);

  it("renders", () => {
    const { asFragment } = render(
      <TestLoggedInStateProvider>
        <LoginModal
          {...{
            modalProps: {
              isOpen: true,
              onClose: () => {}
            }
          }}
        />
      </TestLoggedInStateProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
