import { useState, useEffect } from "react";
import { ThemeProvider, CSSReset, ColorModeProvider } from "@chakra-ui/core";
import { ApolloProvider, ApolloClient } from "@apollo/client";

import { useApollo } from "apollo/client";

const MyApp = ({ Component, pageProps }) => {
  const [apolloClient, setApolloClient] = useState<ApolloClient<any> | null>(
    null
  );
  useEffect(() => {
    useApollo(pageProps.initialApolloState).then((client) =>
      setApolloClient(client)
    );
  }, [pageProps.initialApolloState]);

  if (!apolloClient) return <div>Loading ApolloClient...</div>;

  return (
    <ApolloProvider {...{ client: apolloClient }}>
      <ThemeProvider>
        <ColorModeProvider>
          <CSSReset />
          <Component {...pageProps} />
        </ColorModeProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default MyApp;
