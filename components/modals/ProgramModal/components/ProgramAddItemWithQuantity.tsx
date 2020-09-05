import { useRef } from "react";
import {
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack
} from "@chakra-ui/core";

import { Button } from "components/Button";

export interface Props<T = { id: string; name: string }> {
  items: T[];
  addItem: (item: T, quantity: number) => void;
}

const ProgramAddItemWithQuantity = <T extends { id: string; name: string }>({
  items,
  addItem
}: Props<T>) => {
  const selectRef = useRef<HTMLSelectElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);
  return items.length > 0 ? (
    <Stack {...{ isInline: true }}>
      <Select {...{ ref: selectRef }}>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </Select>
      <span>
        <NumberInput
          {...{
            defaultValue: 1,
            min: 1,
            max: 10
          }}
        >
          <NumberInputField
            {...{
              ref: numberRef
            }}
          />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </span>
      <Button
        {...{
          templateStyle: "primary-outline",
          onClick: () => {
            const itemId = selectRef.current?.value;
            const qty = Number(numberRef.current?.value);
            if (itemId && qty) {
              const item = items.find(({ id }) => id === itemId);
              if (item) {
                addItem(item, qty);
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

export default ProgramAddItemWithQuantity;
