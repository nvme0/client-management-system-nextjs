import React, { ReactNode } from "react";
import {
  Droppable,
  Draggable,
  DraggableProps,
  DroppableProvidedProps
} from "react-beautiful-dnd";
import { Box, Stack } from "@chakra-ui/core";

export interface ITask {
  id: string;
  children: ReactNode;
}

export interface IColumn {
  id: string;
  title: string;
  taskIds: string[];
}

const ColumnTitle = ({ children }: { children: ReactNode }) => (
  <Box {...{ px: 2, pt: 2 }}>
    <h4 className="prose">{children}</h4>
  </Box>
);

export type TaskProps = Omit<DraggableProps, "children"> & {
  children: ReactNode;
};

const Task = ({ draggableId, index, children }: TaskProps) => (
  <Draggable
    {...{
      draggableId,
      index
    }}
  >
    {({ draggableProps, dragHandleProps, innerRef }, { isDragging }) => (
      <Box
        {...{
          ref: innerRef,
          p: 2,
          border: "1px solid",
          borderRadius: 4,
          backgroundColor: "#FFF",
          borderColor: isDragging ? "#3182ce" : "#E2E8F0",
          boxShadow: isDragging ? "0 0 0 2px rgba(66,153,225,0.6)" : undefined,
          opacity: isDragging ? 0.5 : 1,
          _hover: {
            boxShadow: "0 0 0 2px rgba(66,153,225,0.6)"
          },
          ...draggableProps,
          ...dragHandleProps
        }}
      >
        {children}
      </Box>
    )}
  </Draggable>
);

export interface TaskListProps extends DroppableProvidedProps {
  tasks: ITask[];
  innerRef: (element: HTMLElement | null) => any;
  placeholder: ReactNode;
  isDraggingOver: boolean;
}

const TaskList = ({
  tasks,
  innerRef,
  placeholder,
  isDraggingOver
}: TaskListProps) => (
  <Stack
    {...{
      ref: innerRef,
      p: 2,
      spacing: 2,
      minHeight: "58px",
      backgroundColor: isDraggingOver ? "#e2e8f0" : undefined
    }}
  >
    {tasks.map(({ id, children }, index) => (
      <Task {...{ key: id, draggableId: id, index }}>{children}</Task>
    ))}
    {placeholder}
  </Stack>
);

const Column = ({ column, tasks }: { column: IColumn; tasks: ITask[] }) => {
  return (
    <Stack
      {...{
        border: "1px solid #E2E8F0",
        borderRadius: 4,
        minWidth: "170px",
        backgroundColor: "#f7fafc"
      }}
    >
      <ColumnTitle>{column.title}</ColumnTitle>
      <Droppable
        {...{
          droppableId: column.id
        }}
      >
        {({ droppableProps, innerRef, placeholder }, { isDraggingOver }) => (
          <TaskList
            {...{
              tasks,
              ...droppableProps,
              innerRef,
              placeholder,
              isDraggingOver
            }}
          />
        )}
      </Droppable>
    </Stack>
  );
};

export default Column;
