import { Stack, Badge } from "@chakra-ui/core";

import { useOnlineState } from "lib/network";

const Navbar = ({ children }) => {
  const { isOnline } = useOnlineState();
  return (
    <Stack
      {...{
        justifyContent: "flex-end",
        alignItems: "center",
        direction: "row",
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
        <Badge {...{ colorScheme: "green", variant: "outline" }}>Online</Badge>
      ) : (
        <Badge {...{ colorScheme: "red", variant: "outline" }}>Offline</Badge>
      )}
      {children}
    </Stack>
  );
};

export default Navbar;
