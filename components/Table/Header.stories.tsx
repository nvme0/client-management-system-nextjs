import { useMemo } from "react";
import { useTable, useSortBy } from "react-table";

import { Table, Header } from ".";
import { getFakeTableDataColumns } from "./test-utils/generateFakeTableData";

export default {
  title: "Table/Header",
  component: Header
};

export const Default = () => {
  const data = useMemo(() => [], []);
  const columns = useMemo(getFakeTableDataColumns, []);

  const { getTableProps, headerGroups } = useTable({
    data,
    columns
  });

  return (
    <Table {...getTableProps()}>
      <Header {...{ headerGroups }} />
    </Table>
  );
};

export const Sortable = () => {
  const data = useMemo(() => [], []);
  const columns = useMemo(getFakeTableDataColumns, []);

  const { getTableProps, headerGroups } = useTable(
    {
      data,
      columns
    },
    useSortBy
  );

  return (
    <Table {...getTableProps()}>
      <Header {...{ headerGroups }} />
    </Table>
  );
};
