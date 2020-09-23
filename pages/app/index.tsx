import { Heading } from "@chakra-ui/core";
import Head from "next/head";

import AppLayout from "layouts/AppLayout";
import Header from "components/Header";

const Index = () => {
  return (
    <>
      <Head>
        <title>App - Client Management System</title>
      </Head>
      <Header />
      <Heading>Welcome to the App!</Heading>
    </>
  );
};

Index.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Index;
