import { ReactNode } from "react";
import { Box } from "@chakra-ui/core";

import { useOnlineState } from "lib/network";

const OfflineFallbackWrapper = ({ children }: { children: ReactNode }) => {
  const { isOnline } = useOnlineState();
  return isOnline ? (
    <>{children}</>
  ) : (
    <Box
      {...{
        maxW: "lg",
        position: "relative",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      }}
    >
      <Box
        {...{
          m: 4
        }}
      >
        <Box
          {...{
            borderWidth: "1px",
            borderRadius: "lg",
            overflow: "hidden",
            backgroundColor: "#FFF",
            display: "flex",
            justifyContent: "center",
            p: 8
          }}
        >
          <h2 className="prose">This page is not available offline</h2>
        </Box>
      </Box>
    </Box>
  );
};

export default OfflineFallbackWrapper;
