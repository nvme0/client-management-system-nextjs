import { Stack, Box } from "@chakra-ui/core";

export interface Props {
  loginErrors: { type: "none" | "auth" | "network" };
}

const LoginErrors = ({ loginErrors }: Props) => {
  return (
    <Stack>
      <Box>
        {loginErrors.type === "auth" && (
          <>
            <p style={{ color: "#E53E3E" }}>
              <i className={"icon-close icons"} /> Invalid email or password
            </p>
          </>
        )}
        {loginErrors.type === "network" && (
          <>
            <p style={{ color: "#E53E3E" }}>
              <i className={"icon-close icons"} /> Unable to connect to server
            </p>
          </>
        )}
      </Box>
    </Stack>
  );
};

export default LoginErrors;
