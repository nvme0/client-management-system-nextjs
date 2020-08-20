import { Button } from ".";

export default {
  title: "Atoms/Button",
  component: Button
};

export const Primary = () => (
  <Button {...{ templateStyle: "primary" }}>Primary</Button>
);

export const PrimaryOutline = () => (
  <Button {...{ templateStyle: "primary-outline" }}>Primary</Button>
);

export const Secondary = () => (
  <Button {...{ templateStyle: "secondary" }}>Secondary</Button>
);

export const SecondaryOutline = () => (
  <Button {...{ templateStyle: "secondary-outline" }}>Secondary</Button>
);

export const Danger = () => (
  <Button {...{ templateStyle: "danger" }}>Danger</Button>
);

export const DangerOutline = () => (
  <Button {...{ templateStyle: "danger-outline" }}>Danger</Button>
);
