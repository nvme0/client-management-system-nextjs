import { ChakraProvider } from "@chakra-ui/core";
import theme from "../theme";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" }
};

export const decorators = [
  (Story) => (
    <ChakraProvider {...{ theme, resetCSS: true }}>
      <Story />
    </ChakraProvider>
  )
];
