import { TableOptions } from "react-table";
import faker from "faker";
import { v4 as uuid } from "uuid";

export interface DataType {
  id: string;
  name: string;
  email: string;
  number: string;
  joined: string;
}

export const generateFakeData = (
  numberOfEntries: number
): TableOptions<DataType>["data"] =>
  new Array(numberOfEntries).fill(null).map(
    (e) =>
      (e = {
        id: uuid(),
        name: faker.name.firstName() + " " + faker.name.lastName(),
        email: faker.internet.email(),
        number: faker.phone.phoneNumber(),
        joined: faker.date.past().toISOString()
      })
  );

export const getFakeTableDataColumns = (): TableOptions<
  DataType
>["columns"] => [
  {
    Header: "Name",
    accessor: "name"
  },
  {
    Header: "Email",
    accessor: "email"
  },
  {
    Header: "Number",
    accessor: "number"
  },
  {
    Header: "Member Since",
    accessor: "joined"
  }
];
