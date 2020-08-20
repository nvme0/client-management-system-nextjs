import { ChakraProvider } from "@chakra-ui/core";
import GoogleFonts from "next-google-fonts";
import theme from "theme";

import { OutboxProvider } from "lib/outbox";

const MyApp = ({ Component, pageProps }) => {
  return (
    <OutboxProvider>
      <GoogleFonts href="https://fonts.googleapis.com/css?family=Source Sans Pro:300,400,600,700" />
      <ChakraProvider {...{ theme, resetCSS: true }}>
        <Component {...pageProps} />
      </ChakraProvider>
    </OutboxProvider>
  );
};

export default MyApp;
