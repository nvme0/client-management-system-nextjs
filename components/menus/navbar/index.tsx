import { Flex, Badge } from "@chakra-ui/core";

import { useOnlineState } from "lib/network";

const Navbar = ({ children }) => {
  const { isOnline } = useOnlineState();
  return (
    <Flex
      {...{
        direction: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        px: { base: 1, sm: 4 },
        py: 1,
        mb: {
          base: 2,
          sm: 4
        },
        backgroundColor: "#FFF",
        zIndex: 5,
        position: "relative"
      }}
    >
      {isOnline ? (
        <Badge
          {...{
            mr: {
              base: 2,
              md: 0
            },
            colorScheme: "green",
            variant: "outline"
          }}
        >
          Online
        </Badge>
      ) : (
        <Badge
          {...{
            mr: {
              base: 2,
              md: 0
            },
            colorScheme: "red",
            variant: "outline"
          }}
        >
          Offline
        </Badge>
      )}
      {children}
    </Flex>
  );
};

export default Navbar;
