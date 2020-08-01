import Link from "next/link";

export default () => (
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
