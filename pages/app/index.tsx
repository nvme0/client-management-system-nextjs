import { ThemeProvider, CSSReset, Heading } from "@chakra-ui/core";

import Header from "pages/app/components/Header";

export default () => {
  return (
    <ThemeProvider>
      <CSSReset />
      <Header />
      <Heading>Welcome to the App!</Heading>
    </ThemeProvider>
  );
};
