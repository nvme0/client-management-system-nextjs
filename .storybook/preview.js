import { ChakraProvider } from "@chakra-ui/core";
import theme from "../theme";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";

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
