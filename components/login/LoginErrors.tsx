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
            <p>
              <i className={"icon-close icons"} /> Invalid username or password
            </p>
          </>
        )}
        {loginErrors.type === "network" && (
          <>
            <p>
              <i className={"icon-close icons"} /> Unable to connect to server
            </p>
          </>
        )}
      </Box>
    </Stack>
  );
};

export default LoginErrors;
