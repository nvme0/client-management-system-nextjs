import { ComponentType } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  Column,
  TableState,
  PluginHook
} from "react-table";
import { BoxProps } from "@chakra-ui/core";
import dynamic from "next/dynamic";

import { Table, Header } from "../..";
import { IBody } from "../../Body";

export interface Props<D extends { id: string }> {
  data: D[];
  columns: Column<D>[];
  initialState?: Partial<TableState<D>>;
  sortable?: boolean;
  rowSelectCallback?: IBody<D>["rowSelectCallback"];
  tableProps?: BoxProps;
}

const ImportBody = dynamic<IBody<any>>(() => import("../../Body"), {
  ssr: false
});

export const BasicTable = <D extends { id: string }>({
  data,
  columns,
  initialState,
  sortable = false,
  rowSelectCallback,
  tableProps
}: Props<D>) => {
  const Body: ComponentType<IBody<D>> = ImportBody;

  const plugins: PluginHook<D>[] = [usePagination];
  if (sortable) plugins.unshift(useSortBy);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow
  } = useTable(
    {
      data,
      columns,
      initialState
    },
    ...plugins
  );

  return (
    <Table {...getTableProps()} {...{ outerBoxProps: tableProps }}>
      <Header {...{ headerGroups }} />
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
