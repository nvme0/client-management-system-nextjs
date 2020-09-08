import { ChakraProvider, Box, Stack } from "@chakra-ui/core";
import GoogleFonts from "next-google-fonts";
import theme from "theme";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";

import { OnlineStateProvider } from "lib/network";
import { OutboxProvider } from "lib/outbox";
import { LoggedInStateProvider } from "lib/loggedInState";
import Navbar from "components/menus/navbar";
import MobileMenu from "components/menus/mobile";
import DesktopMenu from "components/menus/desktop";

const MyApp = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <GoogleFonts href="https://fonts.googleapis.com/css?family=Source Sans Pro:300,400,600,700" />
      <ChakraProvider {...{ theme, resetCSS: true }}>
        {getLayout(
          <OnlineStateProvider>
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
                  <LoggedInStateProvider>
                    <OutboxProvider>
                      <Component {...pageProps} />
                    </OutboxProvider>
                  </LoggedInStateProvider>
                </Box>
              </Box>
            </Stack>
          </OnlineStateProvider>
        )}
      </ChakraProvider>
    </>
  );
};

export default MyApp;
