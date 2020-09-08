import { FiMenu } from "react-icons/fi";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton
} from "@chakra-ui/core";
import Link from "next/link";

const MobileMenu = () => {
  return (
    <Menu>
      <MenuButton
        {...{
          as: IconButton,
          icon: <FiMenu />,
          variant: "outline",
          display: {
            base: "inline-flex",
            md: "none"
          }
        }}
      />
      <MenuList>
        <Link
          {...{
            href: `/app/calendar`
          }}
        >
          <MenuItem>
            <a className="prose">Calendar</a>
          </MenuItem>
        </Link>
        <Link
          {...{
            href: `/app/clients`
          }}
        >
          <MenuItem>
            <a className="prose">Clients</a>
          </MenuItem>
        </Link>
        <Link
          {...{
            href: `/app/services`
          }}
        >
          <MenuItem>
            <a className="prose">Services</a>
          </MenuItem>
        </Link>
        <Link
          {...{
            href: `/app/programs`
          }}
        >
          <MenuItem>
            <a className="prose">Programs</a>
          </MenuItem>
        </Link>
      </MenuList>
    </Menu>
  );
};

export default MobileMenu;
