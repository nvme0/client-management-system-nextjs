import defaultTheme, { Theme } from "@chakra-ui/theme";
import { extendTheme } from "@chakra-ui/core";

const mode = (lightMode: string, darkMode: string) => (props: {
  colorMode: "light" | "dark";
}) => (props.colorMode === "dark" ? darkMode : lightMode);

export const theme: Theme = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        fontFamily: "body",
        color: mode("gray.800", "whiteAlpha.900")(props),
        bg: mode("gray.50", "gray.800")(props),
        lineHeight: "base"
      },
      "*::placeholder": {
        color: mode("gray.400", "whiteAlpha.400")(props)
      },
      "*, *::before, &::after": {
        borderColor: mode("gray.200", "whiteAlpha.300")(props),
        wordWrap: "break-word"
      },
      fontFeatureSettings: `"pnum"`,
      fontVariantNumeric: "proportional-nums",
      ".card": {
        bg: mode("white", "gray.700")(props)
      },
      "h1.prose": {
        lineHeight: 1.2,
        fontWeight: "bold",
        fontSize: "1.875rem",
        letterSpacing: "-.025em"
      },
      "h2.prose": {
        lineHeight: 1,
        fontWeight: "semibold",
        fontSize: "1.5rem",
        letterSpacing: "-.025em"
      },
      "h3.prose": {
        lineHeight: 1.25,
        fontWeight: "semibold",
        fontSize: "1.25rem",
        letterSpacing: "-.025em"
      },
      "h4.prose": {
        lineHeight: 1.375,
        fontWeight: "semibold",
        fontSize: "1.125rem"
      },
      "a.prose": {
        color: "blue.500",
        fontWeight: "semibold",
        transition: "color 0.15s",
        transitionTimingFunction: "ease-out",
        _hover: {
          color: "blue.600"
        }
      }
    })
  },
  fonts: {
    ...defaultTheme.fonts,
    body: "Source Sans Pro, " + defaultTheme.fonts.body,
    heading: "Source Sans Pro, " + defaultTheme.fonts.heading
  }
});

export default theme;
