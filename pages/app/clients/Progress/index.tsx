import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { MutateFunction } from "react-query";
import { Stack, Select } from "@chakra-ui/core";
import { GrDrag } from "react-icons/gr";

import BasicDragAndDropColumns from "components/DragAndDrop/Basic";

import {
  GetClients,
  GetClients_getClients as Client
} from "gql/__generated__/GetClients";

export interface Props {
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

const Progress = ({ clients, upsertClient }: Props) => {
  const [{ clientSideOnly, clientIndex, programIndex }, setState] = useState<{
    clientSideOnly: boolean;
    clientIndex: number;
    programIndex: number;
  }>({
    clientSideOnly: false,
    clientIndex: 0,
    programIndex: -1
  });

  useEffect(() => {
    const newClientIndex = clients.findIndex(
      (client) => client.id === clients[clientIndex]?.id
    );
    setState({
      clientSideOnly: true,
      clientIndex: newClientIndex,
      programIndex
    });
  }, [clients]);

  return (
    <Stack {...{ backgroundColor: "#FFF", p: 4, borderRadius: 4 }}>
      <Stack {...{ spacing: 4 }}>
        <Stack {...{ isInline: true }}>
          <div>
            <Select
              {...{
                value: clientIndex,
                onChange: (event) => {
                  const newClientIndex = Number(event.target.value);
                  setState({
                    clientSideOnly,
                    clientIndex: isNaN(newClientIndex) ? -1 : newClientIndex,
                    programIndex: -1
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
          <div>
            <Select
              {...{
                value: programIndex,
                onChange: (event) => {
                  const value = Number(event.target.value);
                  setState({
                    clientSideOnly,
                    clientIndex,
                    programIndex: isNaN(value) ? -1 : value
                  });
                }
              }}
            >
              <option value={-1}>Select a Program</option>
              {clientSideOnly &&
                (clients[clientIndex]?.programs || []).map((program, index) => (
                  <option key={program.id} value={index}>
                    {program.name}
                  </option>
                ))}
            </Select>
          </div>
        </Stack>
      </Stack>

      <Stack {...{ spacing: 6, py: 6 }}>
        {(clients[clientIndex]?.programs || [])[programIndex]?.services?.map(
          ({ service, quantity, used }) => {
            const tasks = {
              [service.id]: { id: service.id, children: <GrDrag /> }
            };

            const columns = {};
            const columnOrder = [`column-${service.id}-0`];

            columns[`column-${service.id}-0`] = {
              id: `column-${service.id}-0`,
              title: "Not Started",
              taskIds: []
            };
            for (let i = 1; i <= quantity; i++) {
              const columnId = `column-${service.id}-${i}`;
              columnOrder.push(columnId);
              columns[columnId] = {
                id: columnId,
                title: `${service.name} (${i})`,
                taskIds: []
              };
            }

            const columnId =
              used > quantity
                ? `column-${service.id}-${quantity}`
                : `column-${service.id}-${used}`;
            columns[columnId] = {
              ...columns[columnId],
              taskIds: [tasks[service.id].id]
            };

            return (
              <Stack {...{ key: service.id, spacing: 2 }}>
                <Stack>
                  <h3 className="prose">{service.name}</h3>
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
                            const services = (client.programs || [])[
                              programIndex
                            ]?.services;
                            if (services) {
                              const serviceIndex = services.findIndex(
                                (service) => service.service.id === taskIds[0]
                              );
                              if (serviceIndex > -1) {
                                services[serviceIndex] = {
                                  ...services[serviceIndex],
                                  used: index
                                };
                                upsertClient({
                                  clientInput: client
                                });
                              }
                            }
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
  );
};

export default Progress;
