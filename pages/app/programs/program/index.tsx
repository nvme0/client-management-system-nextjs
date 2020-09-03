import { useMemo, Dispatch, SetStateAction } from "react";
import { TableOptions } from "react-table";
import { Stack, Box } from "@chakra-ui/core";
import { v4 as uuid } from "uuid";
import { queryCache } from "react-query";

import { Button } from "components/Button";
import { PaginatedTable } from "components/Table";
import CreateProgramModal from "components/modals/ProgramModal/CreateProgramModal";
import EditProgramModal from "components/modals/ProgramModal/EditProgramModal";
import { useQuery, useMutation } from "lib/outbox";

import {
  GQL_GET_PROGRAMS,
  GQL_UPSERT_PROGRAM,
  GQL_DELETE_PROGRAM
} from "gql/Program";
import { GQL_GET_CATEGORIES } from "gql/Category";
import {
  GetPrograms,
  GetPrograms_getPrograms as Program
} from "gql/__generated__/GetPrograms";
import { GetCategories } from "gql/__generated__/GetCategories";
import { DeleteProgram } from "gql/__generated__/DeleteProgram";
import { optimisticUpsert, optimisticDelete } from "lib/optimisticHelpers";

enum QueryKeys {
  GET_PROGRAMS = "GetPrograms",
  GET_CATEGORIES = "GetCategories"
}

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
  const { data: programs } = useQuery<GetPrograms>(
    QueryKeys.GET_PROGRAMS,
    GQL_GET_PROGRAMS,
    {},
    { initialData: { getPrograms: [] } }
  );

  const { data: categories } = useQuery<GetCategories>(
    QueryKeys.GET_CATEGORIES,
    GQL_GET_CATEGORIES,
    {},
    { initialData: { getCategories: [] } }
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
              categories: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            categories: categories?.getCategories || [],
            modalProps: {
              isOpen: true,
              onClose: () => setState({ ...state, Modal: undefined })
            },
            handleSave: (programInput) => {
              upsertProgram({ programInput });
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
            categories: categories?.getCategories || [],
            modalProps: {
              isOpen: true,
              onClose: () => setState({ ...state, Modal: undefined })
            },
            handleSave: (programInput) => {
              upsertProgram({ programInput });
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
      <Box {...{ p: 4 }}>
        <Stack {...{ spacing: 4 }}>
          <Stack>
            <h2 className="prose">Programs</h2>
          </Stack>

          <Stack>
            <Stack {...{ isInline: true, justifyContent: "space-between" }}>
              <Button
                {...{
                  templateStyle: "primary-outline",
                  onClick: handleCreateProgram
                }}
              >
                New Program
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
          tableProps: { px: 4 },
          rowSelectCallback: (original: Program) => () =>
            handleSelectProgram(original)
        }}
      />
    </>
  );
};

export default Programs;
