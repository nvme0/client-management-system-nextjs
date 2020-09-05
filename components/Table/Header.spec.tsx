import { render, cleanup } from "@testing-library/react";
import { useTable, Column } from "react-table";

import { Table, Header } from ".";
import {
  getFakeTableDataColumns,
  DataType
} from "./test-utils/generateFakeTableData";

interface IWrapper {
  data: DataType[];
  columns: Column<DataType>[];
}

const Wrapper = ({ data, columns }: IWrapper) => {
  const { getTableProps, headerGroups } = useTable({
    data,
    columns
  });

  return (
    <Table {...getTableProps()} {...{ outerBoxProps: { px: 4 } }}>
      <Header {...{ headerGroups }} />
    </Table>
  );
};

describe("Header", () => {
  afterEach(cleanup);

  let data: DataType[];
  let columns: Column<DataType>[];

  beforeEach(() => {
    data = [];
    columns = getFakeTableDataColumns();
  });

  it("renders", () => {
    data = [];
    const { asFragment } = render(<Wrapper {...{ data, columns }} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
