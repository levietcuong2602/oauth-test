/* eslint-disable react/no-array-index-key */
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  IconButton,
  TableCell,
  CircularProgress,
} from '@mui/material';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import DragHandleIcon from '@mui/icons-material/DragHandle';

import { PAGINATION_LIMIT } from '@src/constants';
import { getByPath } from '@src/utils/object';
import { StyledCustomTable, StyledTableCell } from './index.style';
import CustomPagination from '../CustomPagination';

const DroppableComponent = ({ onDragEnd, onBeforeDragStart, ...props }) => (
  <DragDropContext onDragEnd={onDragEnd} onBeforeDragStart={onBeforeDragStart}>
    <Droppable droppableId="droppable" direction="vertical">
      {(provided) => (
        <TableBody ref={provided.innerRef} {...props.droppableProps} {...props}>
          {props.children}
          {provided.placeholder}
        </TableBody>
      )}
    </Droppable>
  </DragDropContext>
);

const DraggableTableCell = ({ isDragging, ...props }) => (
  <StyledTableCell {...props}>{props.children}</StyledTableCell>
);

const DraggableComponent = ({ id, index, ...props }) => (
  <Draggable draggableId={`draggable-${id}`} index={index}>
    {(provided) => (
      <TableRow ref={provided.innerRef} {...provided.draggableProps} {...props}>
        <DraggableTableCell {...provided.dragHandleProps}>
          <DragHandleIcon />
        </DraggableTableCell>
        {props.children}
      </TableRow>
    )}
  </Draggable>
);

const CustomTable = ({
  heads,
  items,
  actions,
  pagination = { page: 1, limit: PAGINATION_LIMIT, totalPages: 1, total: 0 },
  onChangePagination,
  disablePagination = false,
  loading,
  border,
  reorderable = false,
  onReorder,
  onBeforeDragStart,
}) => {
  const { t } = useTranslation('common');
  const { page: currentPage, limit, total } = pagination;

  const [data, setData] = useState([]);

  const onDragEnd = useCallback(
    (event) => {
      if (
        !event.destination ||
        event.source.index === event.destination.index
      ) {
        return;
      }

      const reorderedData = [...data];
      const [removed] = reorderedData.splice(event.source.index, 1);
      reorderedData.splice(event.destination.index, 0, removed);
      if (onReorder) onReorder(reorderedData);

      setData(reorderedData);
    },
    [onReorder, data],
  );

  const onBeforeDragStartHook = useCallback(
    (event) => {
      if (onBeforeDragStart) onBeforeDragStart(event);
    },
    [onBeforeDragStart],
  );

  const droppableProps = reorderable
    ? {
        onDragEnd,
        onBeforeDragStart: onBeforeDragStartHook,
      }
    : {};

  useEffect(() => {
    setData(items);
  }, [items]);

  return (
    <StyledCustomTable>
      <TableContainer className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              {data.length > 0 && reorderable && <StyledTableCell />}
              {heads.map((head, columnNo) => (
                <StyledTableCell
                  key={columnNo}
                  border={border}
                  align={head.align}
                >
                  {head.valueName === 'no' ? t(head.label) : head.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          {loading && <CircularProgress color="primary" />}
          <TableBody
            {...droppableProps}
            component={reorderable ? DroppableComponent : undefined}
          >
            {!data.length && !loading && (
              <TableRow>
                <StyledTableCell
                  className="body-cell"
                  colSpan={heads.length}
                  align="center"
                >
                  {t('noDataFound')}
                </StyledTableCell>
              </TableRow>
            )}

            {!loading &&
              data.map((item, index) => (
                <TableRow
                  key={item.id}
                  id={item.id}
                  component={reorderable ? DraggableComponent : undefined}
                  index={index}
                >
                  {heads.map((head) => {
                    if (item.id === 'totalRow') {
                      return (
                        <TableCell
                          className="table-cell"
                          align={head.align}
                          key={head.valueName}
                        >
                          {head.valueName !== 'actions' &&
                          head.valueName !== 'no' &&
                          (item[head.valueName] || item[head.valueName] === 0)
                            ? item[head.valueName]
                            : ' '}
                        </TableCell>
                      );
                    }

                    return (
                      <StyledTableCell border={border} align={head.align}>
                        {head.valueName === 'no' && index + 1}
                        {head.valueName === 'actions' &&
                          actions.length &&
                          Object.keys(item).length !== 0 &&
                          actions.map((action) => (
                            <IconButton
                              className="icon-button"
                              onClick={() => action.onClick(item)}
                              disabled={action.disable}
                              key={action.icon}
                            >
                              {typeof action.icon === 'function'
                                ? action.icon(item)
                                : action.icon}
                            </IconButton>
                          ))}
                        {head.valueName !== 'actions' &&
                          head.valueName !== 'no' &&
                          getByPath(item, head.valueName)}
                      </StyledTableCell>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!disablePagination && !loading && (
        <CustomPagination
          currentPage={currentPage}
          limit={limit}
          total={total}
          onChangePagination={onChangePagination}
        />
      )}
    </StyledCustomTable>
  );
};

export default CustomTable;
