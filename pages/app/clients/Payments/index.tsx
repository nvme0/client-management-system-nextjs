import { cloneDeep } from "lodash";
import { v4 as uuid } from "uuid";
import { useEffect, useState } from "react";
import { MutateFunction } from "react-query";
import { Stack, Select } from "@chakra-ui/core";
import { GrDrag } from "react-icons/gr";

import { Button } from "components/Button";
import BasicDragAndDropColumns from "components/DragAndDrop/Basic";

import {
  GetClients,
  GetClients_getClients as Client
} from "gql/__generated__/GetClients";
import CreatePaymentPlanModal from "components/modals/PaymentPlanModal/CreatePaymentPlanModal";

export interface Props {
  setModal: (Modal?: () => JSX.Element) => void;
  clients: Client[];
  upsertClient: MutateFunction<
    GetClients,
    Error,
    {
      clientInput: Client;
    },
    () => void
  >;
}

const ClientList = ({ setModal, clients, upsertClient }: Props) => {
  const [{ clientSideOnly, clientIndex }, setState] = useState<{
    clientSideOnly: boolean;
    clientIndex: number;
  }>({
    clientSideOnly: false,
    clientIndex: -1
  });

  useEffect(() => {
    const newClientIndex = clients.findIndex(
      (client) => client.id === clients[clientIndex]?.id
    );
    setState({
      clientSideOnly: true,
      clientIndex: newClientIndex
    });
  }, [clients]);

  return (
    <Stack {...{ backgroundColor: "#FFF", p: 4, borderRadius: 4 }}>
      <Stack {...{ spacing: 4 }}>
        <Stack {...{ isInline: true }}>
          <Button
            {...{
              templateStyle: "primary-outline",
              onClick: () =>
                setModal(() => (
                  <CreatePaymentPlanModal
                    {...{
                      clients,
                      clientIndex,
                      programs: [],
                      paymentPlan: {
                        id: uuid(),
                        title: "",
                        paymentNumber: 0,
                        installments: [],
                        notes: ""
                      },
                      modalProps: {
                        isOpen: true,
                        onClose: () => setModal()
                      },
                      handleSave: (client) =>
                        upsertClient({
                          clientInput: client
                        })
                    }}
                  />
                ))
            }}
          >
            New Payment Plan
          </Button>
          <div>
            <Select
              {...{
                value: clientIndex,
                onChange: (event) => {
                  const newClientIndex = Number(event.target.value);
                  setState({
                    clientSideOnly,
                    clientIndex: isNaN(newClientIndex) ? -1 : newClientIndex
                  });
                }
              }}
            >
              <option value={-1}>Select a Client</option>
              {clientSideOnly &&
                clients.map((client, index) => (
                  <option key={client.id} value={index}>
                    {client.firstName}
                    {client.lastName ? " " + client.lastName : ""}
                  </option>
                ))}
            </Select>
          </div>
        </Stack>

        <Stack {...{ spacing: 6, py: 6 }}>
          {clients[clientIndex]?.paymentPlans?.map(
            ({ id, title, paymentNumber, installments }, index) => {
              const numberOfInstallments = (installments || []).length;
              const tasks = {
                [id]: { id, children: <GrDrag /> }
              };

              const columns = {};
              const columnOrder = [`column-${id}-0`];

              columns[`column-${id}-0`] = {
                id: `column-${id}-0`,
                title: "Not Started",
                taskIds: []
              };
              const sortedInstallments = installments?.sort(
                ({ date: a }, { date: b }) =>
                  new Date(a).getTime() - new Date(b).getTime()
              );

              (sortedInstallments || []).forEach((installment, i) => {
                const columnId = `column-${id}-${i + 1}`;
                columnOrder.push(columnId);
                columns[columnId] = {
                  id: columnId,
                  title: `Installment ${i + 1} ($${installment.amount})`,
                  taskIds: []
                };
              });

              const columnId =
                paymentNumber > numberOfInstallments
                  ? `column-${id}-${numberOfInstallments}`
                  : `column-${id}-${paymentNumber}`;
              columns[columnId] = {
                ...columns[columnId],
                taskIds: [tasks[id].id]
              };

              return (
                <Stack {...{ key: id, spacing: 2 }}>
                  <Stack>
                    <h3 className="prose">{title}</h3>
                  </Stack>
                  <BasicDragAndDropColumns
                    {...{
                      tasks,
                      columns,
                      columnOrder,
                      setData: ({ columns }) => {
                        Object.values(columns).forEach(({ taskIds }, index) => {
                          if (taskIds.length > 0) {
                            const client = cloneDeep(clients[clientIndex]);
                            if (client) {
                              upsertClient({
                                clientInput: {
                                  ...client,
                                  paymentPlans:
                                    client.paymentPlans?.map((plan) => {
                                      if (plan.id === id) {
                                        return {
                                          ...plan,
                                          paymentNumber: index
                                        };
                                      }
                                      return plan;
                                    }) || []
                                }
                              });
                            }
                          }
                        });
                      }
                    }}
                  />
                </Stack>
              );
            }
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ClientList;
