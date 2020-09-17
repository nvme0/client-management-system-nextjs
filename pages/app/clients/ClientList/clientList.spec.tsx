import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import preloadAll from "jest-next-dynamic";

import ClientList, { Props } from ".";

describe("ClientList on Clients Page", () => {
  beforeAll(async () => {
    await preloadAll();
  });

  afterEach(cleanup);

  let props: Props;

  beforeEach(() => {
    props = {
      columns: [
        {
          Header: "FirstName",
          accessor: "firstName"
        },
        {
          Header: "LastName",
          accessor: "lastName"
        },
        {
          Header: "Email",
          accessor: "email"
        },
        {
          Header: "Number",
          accessor: "phone"
        }
      ],
      data: [],
      initialState: {
        sortBy: [
          {
            id: "lastName",
            desc: false
          }
        ]
      },
      handleCreateClient: jest.fn(),
      handleSelectClient: jest.fn()
    };
  });

  it("renders", () => {
    const { asFragment } = render(<ClientList {...{ ...props }} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
