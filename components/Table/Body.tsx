import { MouseEventHandler } from "react";
import { TBody, TRow, TCell } from ".";
import { Row as R, TableBodyPropGetter, TableBodyProps } from "react-table";

export interface IBody<D extends { id: string }> {
  getTableBodyProps: (propGetter?: TableBodyPropGetter<D>) => TableBodyProps;
  page: R<D>[]; // can also pass in row if not paginated
  prepareRow: (row: R<D>) => void;
  rowSelectCallback?: (original: D) => MouseEventHandler<HTMLDivElement>;
}

const Body = <D extends { id: string }>({
  getTableBodyProps,
  page,
  prepareRow,
  rowSelectCallback
}: IBody<D>) => {
  return (
    <TBody {...getTableBodyProps()}>
      {page.map((row) => {
        prepareRow(row);
        return (
          <TRow
            {...row.getRowProps()}
            {...{
              "data-testid": `row-${row.original.id}`,
              _hover: rowSelectCallback ? { bg: "gray.200" } : undefined,
              cursor: rowSelectCallback ? "pointer" : undefined,
              onClick: rowSelectCallback
                ? rowSelectCallback(row.original)
                : undefined
            }}
          >
            {row.cells.map((cell) => (
              <TCell {...cell.getCellProps()}>{cell.render("Cell")}</TCell>
            ))}
          </TRow>
        );
      })}
    </TBody>
  );
};

export default Body;
