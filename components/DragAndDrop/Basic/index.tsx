import { ReactNode } from "react";
import {
  DragDropContext,
  DropResult,
  resetServerContext
} from "react-beautiful-dnd";
import { Stack } from "@chakra-ui/core";

import Column from "../components/Column";

export interface Data<T = { id: string; children: ReactNode }> {
  tasks: { [id: string]: T };
  columns: { [id: string]: { id: string; title: string; taskIds: string[] } };
  columnOrder: string[];
}

export interface Props<T = { id: string; children: ReactNode }>
  extends Data<T> {
  setData: (newData: Data<T>) => void;
}

const Basic = ({ tasks, columns, columnOrder, setData }: Props) => {
  const handleOnDragEnd = ({
    destination,
    source,
    draggableId
  }: DropResult) => {
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];
    const sameColumn = sourceColumn.id === destinationColumn.id;

    const sourceTaskIds = Array.from(sourceColumn.taskIds);
    sourceTaskIds.splice(source.index, 1);

    const destinationTaskIds = sameColumn
      ? sourceTaskIds
      : Array.from(destinationColumn.taskIds);
    destinationTaskIds.splice(destination.index, 0, draggableId);

    const newData: Data = {
      tasks,
      columnOrder,
      columns: {
        ...columns,
        [destinationColumn.id]: {
          ...destinationColumn,
          taskIds: destinationTaskIds
        }
      }
    };

    if (!sameColumn) {
      newData.columns = {
        ...newData.columns,
        [sourceColumn.id]: {
          ...sourceColumn,
          taskIds: sourceTaskIds
        }
      };
    }

    setData(newData);
  };

  resetServerContext();
  return (
    <DragDropContext
      {...{
        onDragEnd: handleOnDragEnd
      }}
    >
      <Stack {...{ direction: "row", spacing: 2 }}>
        {columnOrder.map((columnId) => {
          const column = columns[columnId];
          return (
            <Column
              {...{
                key: columnId,
                column,
                tasks: column.taskIds.map((taskId) => tasks[taskId])
              }}
            />
          );
        })}
      </Stack>
    </DragDropContext>
  );
};

export default Basic;
