import { ChakraProvider } from "@chakra-ui/core";
import GoogleFonts from "next-google-fonts";
import theme from "theme";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";

import { OnlineStateProvider } from "lib/network";
import { OutboxProvider } from "lib/outbox";
import { LoggedInStateProvider } from "lib/loggedInState";

const MyApp = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <GoogleFonts href="https://fonts.googleapis.com/css?family=Source Sans Pro:300,400,600,700" />
      <ChakraProvider {...{ theme, resetCSS: true }}>
        <OnlineStateProvider>
          {getLayout(
            <LoggedInStateProvider>
              <OutboxProvider>
                <Component {...pageProps} />
              </OutboxProvider>
            </LoggedInStateProvider>
          )}
        </OnlineStateProvider>
      </ChakraProvider>
    </>
  );
};

export default MyApp;
