import { render, cleanup } from "@testing-library/react";
import { TableOptions } from "react-table";
import "@testing-library/jest-dom/extend-expect";
import preloadAll from "jest-next-dynamic";

import { PaginatedTable } from ".";

interface DataType {
  id: string;
  name: string;
  email: string;
}

describe("Paginated Table", () => {
  beforeAll(async () => {
    await preloadAll();
  });

  afterEach(cleanup);

  it("renders", () => {
    const data: DataType[] = [
      {
        id: "4089eabc-69fd-4525-9a41-a3a3177cfdee",
        name: "Aidan Carroll",
        email: "Anjali98@yahoo.com"
      },
      {
        id: "be3a1694-619e-41bc-a130-bd8106e4cd64",
        name: "Alexie Wolf",
        email: "Bennett_Wolf61@yahoo.com"
      },
      {
        id: "4ce723a1-d977-49a6-8bdf-08f9cfe082d0",
        name: "Noel Robel",
        email: "Alfonso76@gmail.com"
      },
      {
        id: "81307903-21fb-4a3e-a031-96c7ece935a4",
        name: "Terrance Schamberger",
        email: "Dustin25@yahoo.com"
      },
      {
        id: "1c1ea6eb-b613-4ea5-8360-a322655a159a",
        name: "Silas Reinger",
        email: "Sydney38@gmail.com"
      },
      {
        id: "305ad759-3023-4007-88f3-29b3b5c15fa7",
        name: "Brody Morissette",
        email: "Barry.Moore24@hotmail.com"
      },
      {
        id: "be422b54-20ed-4cb7-8cb1-de95c2d49f6d",
        name: "Thalia Schulist",
        email: "Nyah.Durgan@gmail.com"
      },
      {
        id: "7bbb91a6-2000-4de3-b0e7-4c4bb82ab562",
        name: "Ora Will",
        email: "Lucious13@hotmail.com"
      },
      {
        id: "fbc4f8dd-d2f5-48fe-9f56-33f649996d7e",
        name: "Easton Schaden",
        email: "Darrel14@yahoo.com"
      },
      {
        id: "d6b1928b-ba9b-420f-9aa2-95911ad4e370",
        name: "Sanford Torp",
        email: "Ryley79@hotmail.com"
      },
      {
        id: "e67ef985-94f4-40e8-b7f8-edb7908f4598",
        name: "Stanford Kuphal",
        email: "Cyril.Carter62@yahoo.com"
      },
      {
        id: "f09f6736-158e-40d5-8cc5-52b6a79cd0fe",
        name: "Neha Borer",
        email: "Claud.Jast@yahoo.com"
      }
    ];

    const columns: TableOptions<DataType>["columns"] = [
      {
        Header: "Name",
        accessor: "name"
      },
      {
        Header: "Email",
        accessor: "email"
      }
    ];

    const initialState = {
      sortBy: [
        {
          id: "name",
          desc: false
        }
      ]
    };

    const { asFragment } = render(
      <PaginatedTable
        {...{
          data,
          columns,
          initialState,
          tableProps: { px: 4 }
        }}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
