import { useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";

import { Table, Body } from ".";
import {
  generateFakeData,
  getFakeTableDataColumns
} from "./test-utils/generateFakeTableData";

export default {
  title: "Table/Body",
  component: Table
};

export const Default = () => {
  const data = useMemo(() => generateFakeData(1), []);
  const columns = useMemo(getFakeTableDataColumns, []);

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
          prepareRow
        }}
      />
    </Table>
  );
};

export const Selectable = () => {
  const data = useMemo(() => generateFakeData(1), []);
  const columns = useMemo(getFakeTableDataColumns, []);

  const { getTableProps, getTableBodyProps, page, prepareRow } = useTable(
    {
      data,
      columns
    },
    useSortBy,
    usePagination
  );

  const onRowSelectHandler = (original: typeof data[0]) => () => {
    alert("id: " + original.id);
  };

  return (
    <Table {...getTableProps()} {...{ outerBoxProps: { px: 4 } }}>
      <Body
        {...{
          getTableBodyProps,
          page,
          prepareRow,
          rowSelectCallback: onRowSelectHandler
        }}
      />
    </Table>
  );
};
