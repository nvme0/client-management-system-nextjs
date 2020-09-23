import { useState, useMemo } from "react";
import Head from "next/head";
import { TableOptions } from "react-table";
import { Tabs, TabPanel, TabList, TabPanels, Stack } from "@chakra-ui/core";
import { v4 as uuid } from "uuid";
import { queryCache } from "react-query";
import { FiRotateCw } from "react-icons/fi";

import AppLayout from "layouts/AppLayout";
import { Button } from "components/Button";
import Tab from "components/Tab";
import Progress from "components/Progress";
import Payments from "components/Payments";
import ClientList from "components/ClientList";
import CreateClientModal from "components/modals/ClientModal/CreateClientModal";
import EditClientModal from "components/modals/ClientModal/EditClientModal";
import { useQuery, useMutation } from "lib/outbox";
import { QueryKeys } from "lib/queryKeys";

import {
  GQL_GET_CLIENTS,
  GQL_UPSERT_CLIENT,
  GQL_DELETE_CLIENT
} from "gql/Client";
import { GQL_GET_PROGRAMS } from "gql/Program";
import {
  GetClients,
  GetClients_getClients as Client
} from "gql/__generated__/GetClients";
import { GetPrograms } from "gql/__generated__/GetPrograms";
import { DeleteClient } from "gql/__generated__/DeleteClient";
import { optimisticUpsert, optimisticDelete } from "lib/optimisticHelpers";
import LoginModal from "components/modals/LoginModal";
import { useLoggedInState } from "lib/loggedInState";
import { useOnlineState } from "lib/network";

export const Clients = () => {
  const { isOnline } = useOnlineState();
  const { isLoggedIn } = useLoggedInState();
  const [state, setState] = useState<{
    Modal?: () => JSX.Element;
  }>({});

  const setModal = (Modal?: () => JSX.Element) => {
    setState({
      ...state,
      Modal
    });
  };

  const { data: clients, refetch: refetchClients } = useQuery<GetClients>(
    QueryKeys.GET_CLIENTS,
    GQL_GET_CLIENTS,
    {},
    { initialData: { getClients: [] } }
  );

  const { data: programs, refetch: refetchPrograms } = useQuery<GetPrograms>(
    QueryKeys.GET_PROGRAMS,
    GQL_GET_PROGRAMS,
    {},
    { initialData: { getPrograms: [] } }
  );

  const [upsertClient] = useMutation<
    GetClients,
    { clientInput: Client },
    Error,
    () => void
  >(GQL_UPSERT_CLIENT, {
    onMutate: ({ clientInput }) =>
      optimisticUpsert<Client, GetClients>(
        QueryKeys.GET_CLIENTS,
        clientInput,
        "getClients",
        "Clients"
      ),
    onError: (error, clientInput, rollback) => {
      console.error(error);
      // TODO: store the newClient somewhere so the user can edit it and try again later
      rollback();
    },
    onSettled: () => {
      queryCache.invalidateQueries(QueryKeys.GET_CLIENTS);
    }
  });

  const [deleteClient] = useMutation<
    DeleteClient,
    { id: string; deletedAt: string },
    Error,
    () => void
  >(GQL_DELETE_CLIENT, {
    onMutate: ({ id }) =>
      optimisticDelete<Client, GetClients>(
        QueryKeys.GET_CLIENTS,
        id,
        "getClients"
      ),
    onError: (error, clientInput, rollback) => {
      console.error(error);
      // TODO: store the newClient somewhere so the user can edit it and try again later
      rollback();
    },
    onSettled: () => {
      queryCache.invalidateQueries(QueryKeys.GET_CLIENTS);
    }
  });

  const data = useMemo<TableOptions<Client>["data"]>(
    () => clients?.getClients || [],
    [clients]
  );

  const columns = useMemo<TableOptions<Client>["columns"]>(
    () => [
      {
        Header: "FirstName",
        accessor: "firstName"
      },
      {
        Header: "LastName",
        accessor: "lastName"
      },
      {
        Header: "Email",
        accessor: "email"
      },
      {
        Header: "Number",
        accessor: "phone"
      }
    ],
    []
  );

  const initialState = {
    sortBy: [
      {
        id: "lastName",
        desc: false
      }
    ]
  };

  const handleCreateClient = () => {
    setModal(() => (
      <CreateClientModal
        {...{
          client: {
            id: uuid(),
            firstName: "",
            lastName: "",
            address: "",
            email: "",
            phone: "",
            notes: "",
            programs: [],
            paymentPlans: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          programs: programs?.getPrograms || [],
          modalProps: {
            isOpen: true,
            onClose: () => setModal()
          },
          handleSave: (clientInput) => {
            upsertClient({
              clientInput: {
                ...clientInput,
                updatedAt: new Date().toISOString()
              }
            });
          }
        }}
      />
    ));
  };

  const handleSelectClient = (client: Client) => {
    setModal(() => (
      <EditClientModal
        {...{
          client,
          programs: programs?.getPrograms || [],
          modalProps: {
            isOpen: true,
            onClose: () => setModal()
          },
          handleSave: (clientInput) => {
            upsertClient({
              clientInput: {
                ...clientInput,
                updatedAt: new Date().toISOString()
              }
            });
          },
          handleDelete: () => {
            deleteClient({
              id: client.id,
              deletedAt: new Date().toISOString()
            });
          }
        }}
      />
    ));
  };

  return (
    <>
      <Head>
        <title>Clients - Client Management System</title>
      </Head>
      <Tabs>
        <Stack {...{ isInline: true, justifyContent: "space-between" }}>
          <TabList {...{ w: "100%" }}>
            <Tab>List</Tab>
            <Tab>Progress</Tab>
            <Tab>Payments</Tab>
          </TabList>
          <Button
            {...{
              "aria-label": "Refresh Clients and Programs",
              templateStyle: "primary-outline",
              onClick: () => {
                refetchClients();
                refetchPrograms();
              }
            }}
          >
            <FiRotateCw />
          </Button>
        </Stack>

        <TabPanels>
          <TabPanel {...{ px: 0 }}>
            <ClientList
              {...{
                data,
                columns,
                initialState,
                handleCreateClient,
                handleSelectClient
              }}
            />
          </TabPanel>

          <TabPanel {...{ px: 0 }}>
            <Progress {...{ clients: clients?.getClients, upsertClient }} />
          </TabPanel>

          <TabPanel {...{ px: 0 }}>
            <Payments
              {...{ clients: clients?.getClients, upsertClient, setModal }}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
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

Clients.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Clients;
