import { useState, useMemo } from "react";
import { TableOptions } from "react-table";
import { Stack, Box } from "@chakra-ui/core";
import { v4 as uuid } from "uuid";
import { queryCache } from "react-query";

import { Button } from "components/Button";
import { PaginatedTable } from "components/Table";
import CreateClientModal from "components/modals/ClientModal/CreateClientModal";
import EditClientModal from "components/modals/ClientModal/EditClientModal";
import { useQuery, useMutation } from "lib/outbox";

import {
  GQL_GET_CLIENTS,
  GQL_UPSERT_CLIENT,
  GQL_DELETE_CLIENT
} from "gql/Client";
import {
  GetClients,
  GetClients_getClients
} from "gql/__generated__/GetClients";
import { DeleteClient } from "gql/__generated__/DeleteClient";
import { optimisticUpsert, optimisticDelete } from "lib/optimisticHelpers";
import LoginModal from "components/modals/LoginModal";
import { useLoggedInState } from "lib/loggedInState";
import { useOnlineState } from "lib/network";

type Client = Omit<GetClients_getClients, "__typename">;

enum QueryKeys {
  GET_CLIENTS = "GetClients"
}

export const Clients = () => {
  const { isOnline } = useOnlineState();
  const { isLoggedIn } = useLoggedInState();
  const [state, setState] = useState<{
    Modal?: () => JSX.Element;
  }>({});

  const { data: clients } = useQuery<GetClients>(
    QueryKeys.GET_CLIENTS,
    GQL_GET_CLIENTS,
    {},
    { initialData: { getClients: [] } }
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
        accessor: "contactEmail"
      },
      {
        Header: "Number",
        accessor: "contactNumber"
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
    setState({
      ...state,
      Modal: () => (
        <CreateClientModal
          {...{
            client: {
              id: uuid(),
              firstName: "",
              lastName: "",
              address: "",
              contactEmail: "",
              contactNumber: "",
              notes: "",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            modalProps: {
              isOpen: true,
              onClose: () => setState({ ...state, Modal: undefined })
            },
            handleSave: (clientInput) => {
              upsertClient({ clientInput });
            }
          }}
        />
      )
    });
  };

  const handleSelectClient = (client: Client) => {
    setState({
      ...state,
      Modal: () => (
        <EditClientModal
          {...{
            client,
            modalProps: {
              isOpen: true,
              onClose: () => setState({ ...state, Modal: undefined })
            },
            handleSave: (clientInput) => {
              upsertClient({ clientInput });
            },
            handleDelete: () => {
              deleteClient({
                id: client.id,
                deletedAt: new Date().toISOString()
              });
            }
          }}
        />
      )
    });
  };

  return (
    <>
      <Box {...{ p: 4 }}>
        <Stack {...{ spacing: 4 }}>
          <Stack>
            <h2 className="prose">Clients</h2>
          </Stack>

          <Stack>
            <Stack {...{ isInline: true, justifyContent: "space-between" }}>
              <Button
                {...{
                  templateStyle: "primary-outline",
                  onClick: handleCreateClient
                }}
              >
                New Client
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <PaginatedTable
        {...{
          data,
          columns,
          initialState,
          sortable: true,
          rowSelectCallback: (original: Client) => () =>
            handleSelectClient(original)
        }}
      />
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

export default Clients;
