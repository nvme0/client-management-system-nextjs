import { useState } from "react";
import {
  FiCalendar,
  FiUser,
  FiBriefcase,
  FiPackage,
  FiChevronRight,
  FiChevronLeft
} from "react-icons/fi";
import {
  Button,
  Flex,
  Spacer,
  keyframes,
  InterpolationWithTheme
} from "@chakra-ui/core";
import Link from "next/link";

const forwardAnimation = keyframes`
  from {
    width: 68px;
  }
  to {
    width: 200px;
  }
`;

const reverseAnimation = keyframes`
  from {
    width: 200px;
  }
  to {
    width: 68px;
  }
`;

const DesktopMenu = () => {
  const [isOpen, setIsOpen] = useState(true);

  const buttonCss: InterpolationWithTheme<any> = {
    overflowX: "hidden",
    animation: isOpen
      ? `${forwardAnimation} 0.2s linear forwards`
      : `${reverseAnimation} 0.2s linear forwards`
  };

  return (
    <Flex
      {...{
        direction: "column",
        h: "100vh",
        backgroundColor: "#FFF",
        pb: {
          md: 4
        },
        display: {
          base: "none",
          md: "flex"
        }
      }}
    >
      <Flex
        {...{
          direction: "column",
          position: "sticky",
          top: 0,
          pt: "26px"
        }}
      >
        <Link
          {...{
            href: `/app/calendar`
          }}
        >
          <Button
            {...{
              "aria-label": "Calendar",
              size: "lg",
              colorScheme: "blue",
              variant: "ghost",
              borderRadius: 0,
              justifyContent: "left",
              iconSpacing: 8,
              leftIcon: <FiCalendar />,
              css: buttonCss
            }}
          >
            Calendar
          </Button>
        </Link>
        <Spacer />
        <Link
          {...{
            href: `/app/clients`
          }}
        >
          <Button
            {...{
              "aria-label": "Clients",
              size: "lg",
              colorScheme: "blue",
              variant: "ghost",
              borderRadius: 0,
              justifyContent: "left",
              iconSpacing: 8,
              leftIcon: <FiUser />,
              css: buttonCss
            }}
          >
            Clients
          </Button>
        </Link>
        <Spacer />
        <Link
          {...{
            href: `/app/services`
          }}
        >
          <Button
            {...{
              "aria-label": "Services",
              size: "lg",
              colorScheme: "blue",
              variant: "ghost",
              borderRadius: 0,
              justifyContent: "left",
              iconSpacing: 8,
              leftIcon: <FiBriefcase />,
              css: buttonCss
            }}
          >
            Services
          </Button>
        </Link>
        <Spacer />
        <Link
          {...{
            href: `/app/programs`
          }}
        >
          <Button
            {...{
              "aria-label": "Programs",
              size: "lg",
              colorScheme: "blue",
              variant: "ghost",
              borderRadius: 0,
              justifyContent: "left",
              iconSpacing: 8,
              leftIcon: <FiPackage />,
              css: buttonCss
            }}
          >
            Programs
          </Button>
        </Link>
        <Spacer />
        <Button
          {...{
            "aria-label": "Expand",
            size: "lg",
            colorScheme: "blue",
            variant: "ghost",
            borderRadius: 0,
            justifyContent: "left",
            iconSpacing: 8,
            leftIcon: isOpen ? <FiChevronLeft /> : <FiChevronRight />,
            css: buttonCss,
            onClick: () => setIsOpen(!isOpen)
          }}
        />
      </Flex>
    </Flex>
  );
};

export default DesktopMenu;
