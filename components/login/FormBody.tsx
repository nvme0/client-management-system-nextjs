import { Stack } from "@chakra-ui/core";

const FormBody = ({ children }) => {
  return (
    <Stack
      {...{
        px: 4,
        pb: 8,
        spacing: 4
      }}
    >
      {children}
    </Stack>
  );
};

export default FormBody;
