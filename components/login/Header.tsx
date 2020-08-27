import { Box } from "@chakra-ui/core";

const Header = ({ children }) => {
  return (
    <Box
      {...{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#3182ce",
        color: "#FFF",
        p: 4
      }}
    >
      <h2 className="prose">{children}</h2>
    </Box>
  );
};

export default Header;
