import { useTable, useSortBy, usePagination } from "react-table";
import { useMemo } from "react";

import { Table, FooterPaginated } from "..";
import {
  generateFakeData,
  getFakeTableDataColumns
} from "../test-utils/generateFakeTableData";

export default {
  title: "Table/FooterPaginated",
  component: FooterPaginated
};

export const Default = () => {
  const data = useMemo(() => generateFakeData(34), []);
  const columns = useMemo(getFakeTableDataColumns, []);

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
    <Table {...getTableProps()}>
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
