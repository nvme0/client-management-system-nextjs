import { useState, useMemo } from "react";
import { TableOptions } from "react-table";
import { Stack, Box } from "@chakra-ui/core";
import { v4 as uuid } from "uuid";
import { queryCache } from "react-query";

import { Button } from "components/Button";
import { PaginatedTable } from "components/Table";
import CreateServiceModal from "components/modals/ServiceModal/CreateServiceModal";
import EditServiceModal from "components/modals/ServiceModal/EditServiceModal";
import { useQuery, useMutation } from "lib/outbox";

import {
  GQL_GET_SERVICES,
  GQL_UPSERT_SERVICE,
  GQL_DELETE_SERVICE
} from "gql/Service";
import {
  GetServices,
  GetServices_getServices
} from "gql/__generated__/GetServices";
import { DeleteService } from "gql/__generated__/DeleteService";
import { optimisticUpsert, optimisticDelete } from "lib/optimisticHelpers";
import LoginModal from "components/modals/LoginModal";
import { useLoggedInState } from "lib/loggedInState";
import { useOnlineState } from "lib/network";

type Service = Omit<GetServices_getServices, "__typename">;

enum QueryKeys {
  GET_SERVICES = "GetServices"
}

export const Services = () => {
  const { isOnline } = useOnlineState();
  const { isLoggedIn } = useLoggedInState();
  const [state, setState] = useState<{
    Modal?: () => JSX.Element;
  }>({});

  const { data: services } = useQuery<GetServices>(
    QueryKeys.GET_SERVICES,
    GQL_GET_SERVICES,
    {},
    { initialData: { getServices: [] } }
  );

  const [upsertService] = useMutation<
    GetServices,
    { serviceInput: Service },
    Error,
    () => void
  >(GQL_UPSERT_SERVICE, {
    onMutate: ({ serviceInput }) =>
      optimisticUpsert<Service, GetServices>(
        QueryKeys.GET_SERVICES,
        serviceInput,
        "getServices",
        "Services"
      ),
    onError: (error, serviceInput, rollback) => {
      console.error(error);
      // TODO: store the newService somewhere so the user can edit it and try again later
      rollback();
    },
    onSettled: () => {
      queryCache.invalidateQueries(QueryKeys.GET_SERVICES);
    }
  });

  const [deleteService] = useMutation<
    DeleteService,
    { id: string; deletedAt: string },
    Error,
    () => void
  >(GQL_DELETE_SERVICE, {
    onMutate: ({ id }) =>
      optimisticDelete<Service, GetServices>(
        QueryKeys.GET_SERVICES,
        id,
        "getServices"
      ),
    onError: (error, serviceInput, rollback) => {
      console.error(error);
      // TODO: store the newService somewhere so the user can edit it and try again later
      rollback();
    },
    onSettled: () => {
      queryCache.invalidateQueries(QueryKeys.GET_SERVICES);
    }
  });

  const data = useMemo<TableOptions<Service>["data"]>(
    () => services?.getServices || [],
    [services]
  );

  const columns = useMemo<TableOptions<Service>["columns"]>(
    () => [
      {
        Header: "Name",
        accessor: "name"
      }
    ],
    []
  );

  const initialState = {
    sortBy: [
      {
        id: "name",
        desc: false
      }
    ]
  };

  const handleCreateService = () => {
    setState({
      ...state,
      Modal: () => (
        <CreateServiceModal
          {...{
            service: {
              id: uuid(),
              name: "",
              duration: null,
              expires: null,
              notes: "",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            modalProps: {
              isOpen: true,
              onClose: () => setState({ ...state, Modal: undefined })
            },
            handleSave: (serviceInput) => {
              upsertService({ serviceInput });
            }
          }}
        />
      )
    });
  };

  const handleSelectService = (service: Service) => {
    setState({
      ...state,
      Modal: () => (
        <EditServiceModal
          {...{
            service,
            modalProps: {
              isOpen: true,
              onClose: () => setState({ ...state, Modal: undefined })
            },
            handleSave: (serviceInput) => {
              upsertService({ serviceInput });
            },
            handleDelete: () => {
              deleteService({
                id: service.id,
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
            <h2 className="prose">Services</h2>
          </Stack>

          <Stack>
            <Stack {...{ isInline: true, justifyContent: "space-between" }}>
              <Button
                {...{
                  templateStyle: "primary-outline",
                  onClick: handleCreateService
                }}
              >
                New Service
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
          rowSelectCallback: (original: Service) => () =>
            handleSelectService(original)
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

export default Services;
