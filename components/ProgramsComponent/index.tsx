import { useMemo, Dispatch, SetStateAction } from "react";
import { TableOptions } from "react-table";
import { Stack } from "@chakra-ui/core";
import { v4 as uuid } from "uuid";
import { queryCache } from "react-query";
import { FiRotateCw } from "react-icons/fi";

import { Button } from "components/Button";
import { PaginatedTable } from "components/Table";
import CreateProgramModal from "components/modals/ProgramModal/CreateProgramModal";
import EditProgramModal from "components/modals/ProgramModal/EditProgramModal";
import { useQuery, useMutation } from "lib/outbox";
import { QueryKeys } from "lib/queryKeys";

import {
  GQL_GET_PROGRAMS,
  GQL_UPSERT_PROGRAM,
  GQL_DELETE_PROGRAM
} from "gql/Program";
import { GQL_GET_SERVICES } from "gql/Service";
import {
  GetPrograms,
  GetPrograms_getPrograms as Program
} from "gql/__generated__/GetPrograms";
import { GetServices } from "gql/__generated__/GetServices";
import { DeleteProgram } from "gql/__generated__/DeleteProgram";
import { optimisticUpsert, optimisticDelete } from "lib/optimisticHelpers";

export interface Props {
  state: {
    Modal?: (() => JSX.Element) | undefined;
  };
  setState: Dispatch<
    SetStateAction<{
      Modal?: (() => JSX.Element) | undefined;
    }>
  >;
}

export const Programs = ({ state, setState }: Props) => {
  const { data: programs, refetch: refetchPrograms } = useQuery<GetPrograms>(
    QueryKeys.GET_PROGRAMS,
    GQL_GET_PROGRAMS,
    {},
    { initialData: { getPrograms: [] } }
  );

  const { data: services, refetch: refetchServices } = useQuery<GetServices>(
    QueryKeys.GET_SERVICES,
    GQL_GET_SERVICES,
    {},
    { initialData: { getServices: [] } }
  );

  const [upsertProgram] = useMutation<
    GetPrograms,
    { programInput: Program },
    Error,
    () => void
  >(GQL_UPSERT_PROGRAM, {
    onMutate: ({ programInput }) =>
      optimisticUpsert<Program, GetPrograms>(
        QueryKeys.GET_PROGRAMS,
        programInput,
        "getPrograms",
        "Programs"
      ),
    onError: (error, programInput, rollback) => {
      console.error(error);
      // TODO: store the newProgram somewhere so the user can edit it and try again later
      rollback();
    },
    onSettled: () => {
      queryCache.invalidateQueries(QueryKeys.GET_PROGRAMS);
    }
  });

  const [deleteProgram] = useMutation<
    DeleteProgram,
    { id: string; deletedAt: string },
    Error,
    () => void
  >(GQL_DELETE_PROGRAM, {
    onMutate: ({ id }) =>
      optimisticDelete<Program, GetPrograms>(
        QueryKeys.GET_PROGRAMS,
        id,
        "getPrograms"
      ),
    onError: (error, programInput, rollback) => {
      console.error(error);
      // TODO: store the newProgram somewhere so the user can edit it and try again later
      rollback();
    },
    onSettled: () => {
      queryCache.invalidateQueries(QueryKeys.GET_PROGRAMS);
    }
  });

  const data = useMemo<TableOptions<Program>["data"]>(
    () => programs?.getPrograms || [],
    [programs]
  );

  const columns = useMemo<TableOptions<Program>["columns"]>(
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

  const handleCreateProgram = () => {
    setState({
      ...state,
      Modal: () => (
        <CreateProgramModal
          {...{
            program: {
              id: uuid(),
              name: "",
              notes: "",
              services: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            services: services?.getServices || [],
            modalProps: {
              isOpen: true,
              onClose: () => setState({ ...state, Modal: undefined })
            },
            handleSave: (programInput) => {
              upsertProgram({
                programInput: {
                  ...programInput,
                  updatedAt: new Date().toISOString()
                }
              });
            }
          }}
        />
      )
    });
  };

  const handleSelectProgram = (program: Program) => {
    setState({
      ...state,
      Modal: () => (
        <EditProgramModal
          {...{
            program,
            services: services?.getServices || [],
            modalProps: {
              isOpen: true,
              onClose: () => setState({ ...state, Modal: undefined })
            },
            handleSave: (programInput) => {
              upsertProgram({
                programInput: {
                  ...programInput,
                  updatedAt: new Date().toISOString()
                }
              });
            },
            handleDelete: () => {
              deleteProgram({
                id: program.id,
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
      <Stack {...{ spacing: 4 }}>
        <Stack>
          <h2 className="prose">Programs</h2>
        </Stack>

        <Stack>
          <Stack {...{ isInline: true, justifyContent: "space-between" }}>
            <Button
              {...{
                "aria-label": "New Program",
                templateStyle: "primary-outline",
                onClick: handleCreateProgram
              }}
            >
              New Program
            </Button>
            <Button
              {...{
                "aria-label": "Refresh Services and Programs",
                templateStyle: "primary-outline",
                onClick: () => {
                  refetchServices();
                  refetchPrograms();
                }
              }}
            >
              <FiRotateCw />
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <PaginatedTable
        {...{
          data,
          columns,
          initialState,
          sortable: true,
          tableProps: { py: 4 },
          rowSelectCallback: (original: Program) => () =>
            handleSelectProgram(original)
        }}
      />
    </>
  );
};

export default Programs;
