import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { Stack } from "@chakra-ui/core";
import { HeaderGroup } from "react-table";

import { THeader, THead, TRow } from ".";

export interface IHeader<D extends object> {
  headerGroups: HeaderGroup<D>[];
}

export const Header = <D extends object>({ headerGroups }: IHeader<D>) => {
  return (
    <THead>
      {headerGroups.map((headerGroup) => (
        <TRow {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) => (
            <THeader
              {...column.getHeaderProps(
                column.getSortByToggleProps
                  ? column.getSortByToggleProps()
                  : undefined
              )}
            >
              <Stack {...{ isInline: true }}>
                <span>{column.render("Header")}</span>
                <span>
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <FiChevronDown />
                    ) : (
                      <FiChevronUp />
                    )
                  ) : (
                    ""
                  )}
                </span>
              </Stack>
            </THeader>
          ))}
        </TRow>
      ))}
    </THead>
  );
};
