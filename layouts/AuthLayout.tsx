import { ReactNode } from "react";
import Particles from "react-particles-js";
import { Box } from "@chakra-ui/core";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      {...{
        height: "100vh"
      }}
    >
      <Particles
        {...{
          style: {
            position: "absolute",
            height: "100%",
            width: "100%",
            overflow: "hidden",
            zIndex: "-1"
          },
          params: {
            particles: {
              lineLinked: {
                enable: false
              },
              color: {
                value: "#3182ce"
              },
              number: {
                value: 100
              },
              size: {
                value: 4
              },
              move: {
                out_mode: "out",
                direction: "bottom-right"
              },
              collisions: {
                enable: false
              }
            }
          }
        }}
      />
      {children}
    </Box>
  );
};

export default AuthLayout;
