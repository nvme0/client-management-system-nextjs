import { ChakraProvider } from "@chakra-ui/core";
import GoogleFonts from "next-google-fonts";
import theme from "theme";

import { OutboxProvider } from "lib/outbox";

const MyApp = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <>
      <GoogleFonts href="https://fonts.googleapis.com/css?family=Source Sans Pro:300,400,600,700" />
      <ChakraProvider {...{ theme, resetCSS: true }}>
        {getLayout(
          <OutboxProvider>
            <Component {...pageProps} />
          </OutboxProvider>
        )}
      </ChakraProvider>
    </>
  );
};

export default MyApp;
