import { Box } from "@chakra-ui/core";

const Container = ({ children }) => {
  return (
    <Box
      {...{
        maxW: "lg",
        borderWidth: "1px",
        borderRadius: "lg",
        overflow: "hidden",
        backgroundColor: "#FFF",
        position: "relative",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      }}
    >
      {children}
    </Box>
  );
};

export default Container;
