import { ReactNode } from "react";
import { Box, Stack } from "@chakra-ui/core";
import Navbar from "components/menus/navbar";
import MobileMenu from "components/menus/mobile";
import DesktopMenu from "components/menus/desktop";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Stack
      {...{
        direction: "row",
        spacing: 0
      }}
    >
      <DesktopMenu />
      <Box
        {...{
          w: "100%"
        }}
      >
        <Navbar>
          <MobileMenu />
        </Navbar>
        <Box
          {...{
            px: {
              base: 1,
              sm: 4
            }
          }}
        >
          {children}
        </Box>
      </Box>
    </Stack>
  );
};

export default AppLayout;
