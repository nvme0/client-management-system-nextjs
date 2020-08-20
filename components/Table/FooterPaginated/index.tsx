import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight
} from "react-icons/fi";
import { Stack, IconButton } from "@chakra-ui/core";
import dynamic from "next/dynamic";

import { TRow, TCell, TFoot } from "..";

const PageControls = dynamic(() => import("./PageControls"), { ssr: false });

export interface IFooter {
  pageIndex: number;
  gotoPage: (updater: number | ((pageIndex: number) => number)) => void;
  pageCount: number;
  nextPage: () => void;
  canNextPage: boolean;
  previousPage: () => void;
  canPreviousPage: boolean;
  setPageSize: (pageSize: number) => void;
  pageSize: number;
  pageOptions: number[];
  colSpan: number;
}

export const FooterPaginated = ({
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
  colSpan
}: IFooter) => {
  return (
    <TFoot>
      <TRow>
        <TCell {...{ colSpan }}>
          <Stack
            {...{
              isInline: true,
              justifyContent: "space-between"
            }}
          >
            <Stack {...{ isInline: true, alignItems: "center" }}>
              <IconButton
                {...{
                  "aria-label": "First page",
                  onClick: () => gotoPage(0),
                  disabled: !canPreviousPage,
                  icon: <FiChevronsLeft />,
                  size: "sm"
                }}
              />
              <IconButton
                {...{
                  "aria-label": "Previous page",
                  onClick: () => previousPage(),
                  disabled: !canPreviousPage,
                  icon: <FiChevronLeft />,
                  size: "sm"
                }}
              />
            </Stack>
            <Stack {...{ isInline: true, alignItems: "center" }}>
              <PageControls
                {...{
                  gotoPage,
                  pageIndex,
                  pageOptions,
                  pageSize,
                  setPageSize
                }}
              />
            </Stack>
            <Stack {...{ isInline: true, alignItems: "center" }}>
              <IconButton
                {...{
                  "aria-label": "Next page",
                  onClick: () => nextPage(),
                  disabled: !canNextPage,
                  icon: <FiChevronRight />,
                  size: "sm"
                }}
              />
              <IconButton
                {...{
                  "aria-label": "Last page",
                  onClick: () => gotoPage(pageCount - 1),
                  disabled: !canNextPage,
                  icon: <FiChevronsRight />,
                  size: "sm"
                }}
              />
            </Stack>
          </Stack>
        </TCell>
      </TRow>
    </TFoot>
  );
};
