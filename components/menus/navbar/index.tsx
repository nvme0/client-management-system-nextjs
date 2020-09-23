import { useEffect, useState } from "react";
import { Flex, Badge } from "@chakra-ui/core";
import { Button } from "components/Button";

import { useOnlineState } from "lib/network";

const Navbar = ({ children }) => {
  const { isOnline } = useOnlineState();
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  return (
    <Flex
      {...{
        direction: "row",
        justifyContent: "space-between",
        alignItems: "center",
        px: { base: 1, sm: 4 },
        py: 1,
        mb: {
          base: 2,
          sm: 4
        },
        backgroundColor: "#FFF",
        zIndex: 5,
        position: "relative",
        minH: "48px"
      }}
    >
      <Flex
        {...{
          direction: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%"
        }}
      >
        <Button
          {...{
            display: !deferredPrompt ? "none" : undefined,
            // visibility: !deferredPrompt ? "hidden" : undefined,
            // disabled: !deferredPrompt ? true : undefined,
            templateStyle: "primary",
            onClick: (e) => {
              if (!!deferredPrompt) {
                console.log({ deferredPrompt });
                (deferredPrompt as any).prompt();
                (deferredPrompt as any).userChoice.then((choiceResult) => {
                  if (choiceResult.outcome === "accepted") {
                    console.log("User accepted the A2HS prompt");
                  }
                  setDeferredPrompt(null);
                });
              }
            }
          }}
        >
          Add to Homescreen
        </Button>
        {isOnline ? (
          <Badge
            {...{
              mr: {
                base: 2,
                md: 0
              },
              colorScheme: "green",
              variant: "outline"
            }}
          >
            Online
          </Badge>
        ) : (
          <Badge
            {...{
              mr: {
                base: 2,
                md: 0
              },
              colorScheme: "red",
              variant: "outline"
            }}
          >
            Offline
          </Badge>
        )}{" "}
      </Flex>

      {children}
    </Flex>
  );
};

export default Navbar;
