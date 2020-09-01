import { useMemo, Dispatch, SetStateAction } from "react";
import { TableOptions } from "react-table";
import { Stack, Box } from "@chakra-ui/core";
import { v4 as uuid } from "uuid";
import { queryCache } from "react-query";

import { Button } from "components/Button";
import { PaginatedTable } from "components/Table";
import CreateCategoryModal from "components/modals/CategoryModal/CreateCategoryModal";
import EditCategoryModal from "components/modals/CategoryModal/EditCategoryModal";
import { useQuery, useMutation } from "lib/outbox";

import {
  GQL_GET_CATEGORIES,
  GQL_UPSERT_CATEGORY,
  GQL_DELETE_CATEGORY
} from "gql/Category";
import {
  GetCategories,
  GetCategories_getCategories
} from "gql/__generated__/GetCategories";
import { DeleteCategory } from "gql/__generated__/DeleteCategory";
import { optimisticUpsert, optimisticDelete } from "lib/optimisticHelpers";

type Category = Omit<GetCategories_getCategories, "__typename">;

enum QueryKeys {
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

export const Categories = ({ state, setState }: Props) => {
  const { data: categories } = useQuery<GetCategories>(
    QueryKeys.GET_CATEGORIES,
    GQL_GET_CATEGORIES,
    {},
    { initialData: { getCategories: [] } }
  );

  const [upsertCategory] = useMutation<
    GetCategories,
    { categoryInput: Category },
    Error,
    () => void
  >(GQL_UPSERT_CATEGORY, {
    onMutate: ({ categoryInput }) =>
      optimisticUpsert<Category, GetCategories>(
        QueryKeys.GET_CATEGORIES,
        categoryInput,
        "getCategories",
        "Categories"
      ),
    onError: (error, categoryInput, rollback) => {
      console.error(error);
      // TODO: store the newCategory somewhere so the user can edit it and try again later
      rollback();
    },
    onSettled: () => {
      queryCache.invalidateQueries(QueryKeys.GET_CATEGORIES);
    }
  });

  const [deleteCategory] = useMutation<
    DeleteCategory,
    { id: string; deletedAt: string },
    Error,
    () => void
  >(GQL_DELETE_CATEGORY, {
    onMutate: ({ id }) =>
      optimisticDelete<Category, GetCategories>(
        QueryKeys.GET_CATEGORIES,
        id,
        "getCategories"
      ),
    onError: (error, categoryInput, rollback) => {
      console.error(error);
      // TODO: store the newCategory somewhere so the user can edit it and try again later
      rollback();
    },
    onSettled: () => {
      queryCache.invalidateQueries(QueryKeys.GET_CATEGORIES);
    }
  });

  const data = useMemo<TableOptions<Category>["data"]>(
    () => categories?.getCategories || [],
    [categories]
  );

  const columns = useMemo<TableOptions<Category>["columns"]>(
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

  const handleCreateCategory = () => {
    setState({
      ...state,
      Modal: () => (
        <CreateCategoryModal
          {...{
            category: {
              id: uuid(),
              name: "",
              for: "Program",
              notes: "",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            modalProps: {
              isOpen: true,
              onClose: () => setState({ ...state, Modal: undefined })
            },
            handleSave: (categoryInput) => {
              upsertCategory({ categoryInput });
            }
          }}
        />
      )
    });
  };

  const handleSelectCategory = (category: Category) => {
    setState({
      ...state,
      Modal: () => (
        <EditCategoryModal
          {...{
            category,
            modalProps: {
              isOpen: true,
              onClose: () => setState({ ...state, Modal: undefined })
            },
            handleSave: (categoryInput) => {
              upsertCategory({ categoryInput });
            },
            handleDelete: () => {
              deleteCategory({
                id: category.id,
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
            <h2 className="prose">Categories</h2>
          </Stack>

          <Stack>
            <Stack {...{ isInline: true, justifyContent: "space-between" }}>
              <Button
                {...{
                  templateStyle: "primary-outline",
                  onClick: handleCreateCategory
                }}
              >
                New Category
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
          rowSelectCallback: (original: Category) => () =>
            handleSelectCategory(original)
        }}
      />
    </>
  );
};

export default Categories;
