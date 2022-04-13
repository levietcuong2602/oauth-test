import { MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { COLOR, TRANSPARENT_COLOR } from '@src/styles/color';

export const StyledPlaceholder = styled('div')`
  font-size: 16px;
  font-family: 'SF Pro Display';
  color: rgba(0, 0, 0, 0.38);
`;

export const StyledMenuItem = styled(MenuItem)`
  &.MuiMenuItem-root {
    font-weight: 500;
    &:focus {
      color: ${COLOR.white};
      background-color: ${COLOR.primary};
      &:hover {
        background-color: ${COLOR.primary};
        color: ${COLOR.white};
      }
    }
    &:hover {
      background-color: ${TRANSPARENT_COLOR.primary};
      &.MuiListItemIcon-root,
      &.MuiListItemText-primary {
        color: ${COLOR.white};
      }
    }
  }
`;
