import { Button as ChakraButton, ButtonProps } from "@chakra-ui/core";

export interface Props extends ButtonProps {
  templateStyle:
    | "primary"
    | "primary-outline"
    | "secondary"
    | "secondary-outline"
    | "danger"
    | "danger-outline"
    | "login";
}

export const Button = ({ children, templateStyle, ...props }: Props) => {
  let variant: "solid" | "outline" = "solid";
  let colorScheme: "blue" | "gray" | "red" = "blue";

  switch (templateStyle) {
    case "primary":
      colorScheme = "blue";
      variant = "solid";
      break;
    case "primary-outline":
      colorScheme = "blue";
      variant = "outline";
      break;
    case "secondary":
      colorScheme = "gray";
      variant = "solid";
      break;
    case "secondary-outline":
      colorScheme = "gray";
      variant = "outline";
      break;
    case "danger":
      colorScheme = "red";
      variant = "solid";
      break;
    case "danger-outline":
      colorScheme = "red";
      variant = "outline";
      break;
    case "login":
      colorScheme = "blue";
      variant = "solid";
      props = { ...props, width: "100%" };
      break;
  }

  return (
    <ChakraButton
      {...{
        variant,
        colorScheme
      }}
      {...{ ...props }}
    >
      {children}
    </ChakraButton>
  );
};
