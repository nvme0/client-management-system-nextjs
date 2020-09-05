import { render, cleanup } from "@testing-library/react";
import { useTable, usePagination, Column } from "react-table";
import preloadAll from "jest-next-dynamic";

import { Table, FooterPaginated } from "..";

import {
  generateFakeData,
  getFakeTableDataColumns,
  DataType
} from "../test-utils/generateFakeTableData";

interface IWrapper {
  data: DataType[];
  columns: Column<DataType>[];
}

const Wrapper = ({ data, columns }: IWrapper) => {
  const {
    getTableProps,

    // pagination
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      data,
      columns
    },
    usePagination
  );

  return (
    <Table {...getTableProps()} {...{ outerBoxProps: { px: 4 } }}>
      <FooterPaginated
        {...{
          pageIndex,
          gotoPage,
          pageCount,
          nextPage,
          canNextPage,
          previousPage,
          canPreviousPage,
          setPageSize,
          pageSize,
          pageOptions,
          colSpan: columns.length
        }}
      />
    </Table>
  );
};

describe("Paginated Footer", () => {
  beforeAll(async () => {
    await preloadAll();
  });

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
});
