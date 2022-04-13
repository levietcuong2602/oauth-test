import { styled } from '@mui/material/styles';
import { Breadcrumbs } from '@mui/material';
import { COLOR } from '@src/styles/color';

export const StyledBreadcrumbs = styled(Breadcrumbs)`
  a {
    text-decoration: none;
    font-size: 16px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
  }

  .text {
    font-size: 16px;
    font-weight: 400;
    color: ${COLOR.black};
  }
`;
