import { Tab as BaseTab, TabProps } from "@chakra-ui/core";

const Tab = ({ children }: TabProps) => (
  <BaseTab
    {...{
      fontSize: "lg",
      fontWeight: 600
    }}
  >
    {children}
  </BaseTab>
);

export default Tab;
