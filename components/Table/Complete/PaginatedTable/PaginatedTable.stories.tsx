import { useMemo } from "react";

import { PaginatedTable } from ".";
import {
  generateFakeData,
  getFakeTableDataColumns,
  DataType
} from "components/Table/test-utils/generateFakeTableData";

export default {
  title: "Table/Complete/Paginated",
  component: PaginatedTable
};

export const Default = () => {
  const data = useMemo(() => generateFakeData(34), []);
  const columns = useMemo(getFakeTableDataColumns, []);

  return (
    <PaginatedTable
      {...{
        data,
        columns
      }}
    />
  );
};

export const Sortable = () => {
  const data = useMemo(() => generateFakeData(15), []);
  const columns = useMemo(getFakeTableDataColumns, []);

  return (
    <PaginatedTable
      {...{
        data,
        columns,
        sortable: true
      }}
    />
  );
};

export const Selectable = () => {
  const data = useMemo(() => generateFakeData(15), []);
  const columns = useMemo(getFakeTableDataColumns, []);

  const onRowSelectHandler = (original: DataType) => () => {
    alert("id: " + original.id);
  };

  return (
    <PaginatedTable
      {...{
        data,
        columns,
        sortable: true,
        rowSelectCallback: onRowSelectHandler
      }}
    />
  );
};
