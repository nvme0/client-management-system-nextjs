import { Stack, Box } from "@chakra-ui/core";

export interface Props {
  type: "none" | "auth" | "network" | "custom";
  customMessage?: string;
}

const LoginErrors = ({ type, customMessage }: Props) => {
  return (
    <Stack>
      <Box>
        {type === "auth" && (
          <>
            <p style={{ color: "#E53E3E" }}>Invalid email or password</p>
          </>
        )}
        {type === "network" && (
          <>
            <p style={{ color: "#E53E3E" }}>Unable to connect to server</p>
          </>
        )}
        {type === "custom" && (
          <p style={{ color: "#E53E3E" }}>{customMessage}</p>
        )}
      </Box>
    </Stack>
  );
};

export default LoginErrors;
