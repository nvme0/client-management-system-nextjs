import {
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack
} from "@chakra-ui/core";

export interface Props {
  pageIndex: number;
  gotoPage: (updater: number | ((pageIndex: number) => number)) => void;
  setPageSize: (pageSize: number) => void;
  pageSize: number;
  pageOptions: number[];
  pageSizeOptions?: number[];
  showPageSizeOptions?: boolean;
  showGoToPage?: boolean;
}

const PageControls = ({
  pageIndex,
  gotoPage,
  setPageSize,
  pageSize,
  pageOptions,
  pageSizeOptions = [10, 20, 30, 40, 50],
  showPageSizeOptions = true,
  showGoToPage = false
}: Props) => (
  <Stack
    {...{
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center"
    }}
  >
    <span style={{ marginTop: "0.5rem", marginRight: "0.5rem" }}>
      Page{" "}
      <strong>
        {pageIndex + 1} of {pageOptions.length}
      </strong>
    </span>
    {showPageSizeOptions && (
      <Select
        {...{
          "aria-label": "Select number of items to show per page",
          value: pageSize,
          onChange: (e) => {
            setPageSize(Number(e.target.value));
          },
          size: "sm",
          width: "110px"
        }}
      >
        {pageSizeOptions.map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </Select>
    )}
    {showGoToPage && (
      <>
        <span>Go to page: </span>
        <span>
          <NumberInput
            {...{
              defaultValue: pageIndex + 1,
              min: 1,
              max: pageOptions.length,
              size: "sm"
            }}
          >
            <NumberInputField
              {...{
                onChange: (e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  if (0 <= page && page < pageOptions.length) {
                    gotoPage(page);
                  }
                }
              }}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </span>
      </>
    )}
  </Stack>
);

export default PageControls;
