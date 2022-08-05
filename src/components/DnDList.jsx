import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { Box, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";
import { Button } from "components/materialui";

export const DnDList = ({ data, columns, className, onModifyFinish = () => {}, onCancel }) => {
  const [list, setList] = useState(data);

  function onDragEnd(result) {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const tmp = Array.from(list);
    const [removed] = tmp.splice(result.source.index, 1);
    tmp.splice(result.destination.index, 0, removed);
    console.log('product_array tmp',tmp.length)
    setList(tmp);
  }

  useEffect(() => {
    setList(data);
  }, [data]);

  return (
    <>
      <Box mb={2}>
        <Button color="primary" onClick={() => onModifyFinish(list)}>
          수정 완료
        </Button>
        <Button ml={2} color="secondary" onClick={onCancel}>
          수정 취소
        </Button>
      </Box>
      <Box className={className}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col, index) => (
                <TableCell key={index} style={{ width: col.width }}>
                  {col.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="container">
              {(provided) => (
                <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                  {list?.map((row, index) => {
                    return (
                      <Draggable draggableId={index.toString()} index={index} key={index}>
                        {(provided) => (
                          <TableRow ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            {columns.map((col, index2) => (
                              <TableCell key={index2} style={{ width: col.width, ...col.cellStyle }}>
                                {col.render ? col.render(row) : row[col.field]}
                              </TableCell>
                            ))}
                          </TableRow>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </DragDropContext>
        </Table>
      </Box>

      <Box mt={2}>
        <Button color="primary" onClick={() => onModifyFinish(list)}>
          수정 완료
        </Button>
        <Button ml={2} color="secondary" onClick={onCancel}>
          수정 취소
        </Button>
      </Box>
    </>
  );
};
