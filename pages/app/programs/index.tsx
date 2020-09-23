import { useState } from "react";
import Head from "next/head";

import AppLayout from "layouts/AppLayout";
import ProgramsComponent from "components/ProgramsComponent";
import LoginModal from "components/modals/LoginModal";
import { useLoggedInState } from "lib/loggedInState";
import { useOnlineState } from "lib/network";

export const Programs = () => {
  const { isOnline } = useOnlineState();
  const { isLoggedIn } = useLoggedInState();
  const [state, setState] = useState<{
    Modal?: () => JSX.Element;
  }>({});

  return (
    <>
      <Head>
        <title>Programs - Client Management System</title>
      </Head>
      <ProgramsComponent {...{ state, setState }} />
      {state.Modal && <state.Modal />}
      <LoginModal
        {...{
          modalProps: {
            isOpen: !isLoggedIn && isOnline,
            onClose: () => {}
          }
        }}
      />
    </>
  );
};

Programs.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Programs;
