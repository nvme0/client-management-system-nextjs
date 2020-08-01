import Link from "next/link";

const Header = () => (
  <header>
    <ul>
      <li>
        <Link {...{ href: "/app" }}>
          <a>App</a>
        </Link>
      </li>
    </ul>
  </header>
);

export default Header;
