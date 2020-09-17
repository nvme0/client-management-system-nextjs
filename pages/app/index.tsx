import { Heading } from "@chakra-ui/core";

import AppLayout from "layouts/AppLayout";
import Header from "components/Header";

const Index = () => {
  return (
    <>
      <Header />
      <Heading>Welcome to the App!</Heading>
    </>
  );
};

Index.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Index;
