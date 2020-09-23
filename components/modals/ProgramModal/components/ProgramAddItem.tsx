import { useRef } from "react";
import { Stack, Select } from "@chakra-ui/core";

import { Button } from "components/Button";

export interface Props<T = { id: string; name: string }> {
  items: T[];
  addItem: (item: T) => void;
}

const ProgramAddItem = <T extends { id: string; name: string }>({
  items,
  addItem
}: Props<T>) => {
  const selectRef = useRef<HTMLSelectElement>(null);
  return items.length > 0 ? (
    <Stack {...{ isInline: true }}>
      <Select {...{ ref: selectRef }}>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </Select>
      <Button
        {...{
          "aria-label": "Add",
          templateStyle: "primary-outline",
          onClick: () => {
            const itemId = selectRef.current?.value;
            if (itemId) {
              const item = items.find(({ id }) => id === itemId);
              if (item) {
                addItem(item);
              }
            }
          }
        }}
      >
        Add
      </Button>
    </Stack>
  ) : (
    <span style={{ marginTop: 0 }}></span>
  );
};

export default ProgramAddItem;
