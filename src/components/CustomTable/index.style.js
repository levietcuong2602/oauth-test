import { styled } from '@mui/material/styles';
import { TableCell } from '@mui/material';
import { COLOR } from '@src/styles/color';

export const StyledTableCell = styled(TableCell)`
  &.MuiTableCell-head {
    background-color: #f6f9fc;
    font-weight: 600;
    font-size: 15px;
    // text-transform: uppercase;
    color: ${COLOR.bodyText};
    border: ${(props) =>
      props.border ? '1px solid rgba(224, 224, 224, 1)' : 'none'};
  }
  &.MuiTableCell-body {
    font-size: 16px;
    border: ${(props) =>
      props.border ? '1px solid rgba(224, 224, 224, 1)' : 'none'};
    border-bottom: 1px solid rgba(224, 224, 224, 1);
    background-color: ${COLOR.white};
  }
  &.icon-button {
    padding: 5px;
    background: ${COLOR.white};
    color: ${COLOR.light};
    :hover {
      color: ${COLOR.bodyText};
      background: none;
    }
  }
`;

export const StyledCustomTable = styled('div')`
  .table-cell {
    font-weight: 500;
    font-size: 16px;
  }

  .table-container {
    box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.06);
    overflow: auto;
    max-height: 455px;
  }

  .table-row {
    &:hover {
      box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.1);
      transform: scale(1, 1);
    }
  }
`;
