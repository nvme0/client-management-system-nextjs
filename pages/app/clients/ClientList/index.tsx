import { Column } from "react-table";
import { Stack } from "@chakra-ui/core";

import { Button } from "components/Button";
import { PaginatedTable } from "components/Table";
import { GetClients_getClients as Client } from "gql/__generated__/GetClients";

export interface Props<S = Record<string, unknown>> {
  data: Client[];
  columns: Column<Client>[];
  initialState: S;
  handleCreateClient: () => void;
  handleSelectClient: (client: Client) => void;
}

const ClientList = ({
  data,
  columns,
  initialState,
  handleCreateClient,
  handleSelectClient
}: Props) => (
  <>
    <Stack {...{ spacing: 4 }}>
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

    <PaginatedTable
      {...{
        data,
        columns,
        initialState,
        sortable: true,
        tableProps: { py: 4 },
        rowSelectCallback: (original: Client) => () =>
          handleSelectClient(original)
      }}
    />
  </>
);

export default ClientList;
