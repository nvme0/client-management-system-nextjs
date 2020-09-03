import { useRef } from "react";
import { Stack, Select } from "@chakra-ui/core";

import { Button } from "components/Button";
import { GetCategories_getCategories as Category } from "gql/__generated__/GetCategories";

export interface Props {
  categories: Category[];
  addCategory: (category: Category) => void;
}

const ProgramAddItem = ({ categories, addCategory }: Props) => {
  const selectRef = useRef<HTMLSelectElement>(null);
  return categories.length > 0 ? (
    <Stack {...{ isInline: true }}>
      {" "}
      <Select {...{ ref: selectRef }}>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
      <Button
        {...{
          templateStyle: "primary-outline",
          onClick: () => {
            const categoryId = selectRef.current?.value;
            if (categoryId) {
              const category = categories.find(({ id }) => id === categoryId);
              if (category) {
                addCategory(category);
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
