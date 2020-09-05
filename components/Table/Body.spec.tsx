import { MouseEventHandler } from "react";
import { render, cleanup } from "@testing-library/react";
import { useTable, useSortBy, usePagination, Column } from "react-table";

import { Table, Body } from ".";
import {
  generateFakeData,
  getFakeTableDataColumns,
  DataType
} from "./test-utils/generateFakeTableData";

interface IWrapper {
  data: DataType[];
  columns: Column<DataType>[];
  rowSelectCallback?: (original: DataType) => MouseEventHandler<HTMLDivElement>;
}

const Wrapper = ({ data, columns, rowSelectCallback }: IWrapper) => {
  const { getTableProps, getTableBodyProps, page, prepareRow } = useTable(
    {
      data,
      columns
    },
    useSortBy,
    usePagination
  );

  return (
    <Table {...getTableProps()} {...{ outerBoxProps: { px: 4 } }}>
      <Body
        {...{
          getTableBodyProps,
          page,
          prepareRow,
          rowSelectCallback
        }}
      />
    </Table>
  );
};

describe("Body", () => {
  afterEach(cleanup);

  let data: DataType[];
  let columns: Column<DataType>[];

  beforeEach(() => {
    data = generateFakeData(1);
    columns = getFakeTableDataColumns();
  });

  it("renders", () => {
    data = [
      {
        id: "4ce723a1-d977-49a6-8bdf-08f9cfe082d0",
        name: "Cydney Bayer",
        email: "Llewellyn.Walker@yahoo.com",
        number: "180.989.3846 x09734",
        joined: "2019-10-10T00:53:43.549Z"
      }
    ];

    const { asFragment } = render(<Wrapper {...{ data, columns }} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("calls row callback function on click", () => {
    const props: IWrapper = {
      data,
      columns,
      rowSelectCallback: (original: DataType) => () => {}
    };
    jest.spyOn(props, "rowSelectCallback");

    const { getByTestId } = render(<Wrapper {...props} />);
    const row = getByTestId(`row-${data[0].id}`);

    row.click();

    expect(props.rowSelectCallback).toBeCalledTimes(1);
    expect(props.rowSelectCallback).toBeCalledWith(data[0]);
  });
});
