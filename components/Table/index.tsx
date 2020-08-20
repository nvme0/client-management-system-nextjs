import { Box, BoxProps } from "@chakra-ui/core";

export { Header } from "./Header";
export { FooterPaginated } from "./FooterPaginated";
export { default as Body } from "./Body";

export { PaginatedTable } from "./Complete/PaginatedTable";

export const Table = (props: BoxProps) => (
  <Box {...{ overflow: "hidden", px: 4 }}>
    <Box
      {...{
        className: "card",
        borderWidth: "1px",
        rounded: "md",
        overflow: "auto"
      }}
    >
      <Box
        {...{
          as: "table",
          width: "full"
        }}
        {...props}
      />
    </Box>
  </Box>
);

export const THead = (props: BoxProps) => (
  <Box {...{ as: "thead" }} {...props} />
);

export const TFoot = (props: BoxProps) => (
  <Box {...{ as: "tfoot", borderTopWidth: "2px" }} {...props} />
);

export const TRow = (props: BoxProps) => (
  <Box {...{ as: "tr", borderBottomWidth: "1px" }} {...props} />
);

export const THeader = (props: BoxProps) => (
  <Box
    {...{
      as: "th",
      px: 6,
      py: 3,
      borderBottomWidth: "1px",
      backgroundColor: "gray.100",
      textAlign: "left",
      fontSize: "s",
      color: "gray.700",
      letterSpacing: "wider",
      lineHeight: "1rem",
      fontWeight: "bold"
    }}
    {...props}
  />
);

export const TBody = (props: BoxProps) => (
  <Box {...{ as: "tbody" }} {...props} />
);

export const TCell = (props: BoxProps) => (
  <Box
    {...{
      as: "td",
      px: 6,
      py: 4,
      lineHeight: "1.25rem",
      whiteSpace: "nowrap"
    }}
    {...props}
  />
);
