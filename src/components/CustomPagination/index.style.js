import { styled } from '@mui/material/styles';
import { COLOR } from '@src/styles/color';

export const StyledCustomPagination = styled('div')`
  margin: 15px 0;

  .pagination-text {
    color: ${COLOR.secondary};
    font-weight: 400;
  }

  .pagination {
    .Mui-selected {
      color: #fff;
      background: ${COLOR.primary};
    }
  }
`;
