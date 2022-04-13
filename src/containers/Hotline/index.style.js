import { MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { COLOR, TRANSPARENT_COLOR } from '@src/styles/color';
import { BORDER_RADIUS } from '@src/styles/config';

export const StyledHotline = styled('div')`
  .heading-text {
    font-size: 24px;
    font-weight: 500;
    color: ${COLOR.headingText};
    margin-bottom: 26px;
  }

  .search-text-field {
    background-color: white;
    height: fit-content;
    width: 420px;
    margin-right: 20px;
    margin-top: 8px;
    border-radius: 20px;
    left: -12px;

    .MuiInputBase-root {
      border-radius: 20px;
      input {
        font-size: 14px;
      }
    }
    .MuiInputBase-input {
      padding-top: 10.5px;
      padding-bottom: 10.5px;
    }
    .MuiInputLabel-root {
      font-size: 14px;
      font-weight: 500;
      color: ${COLOR.bodyText};
    }
  }

  .filter {
    margin-bottom: 27px;
  }

  .text-field {
    background-color: #fff;
    height: fit-content;
    border-radius: ${BORDER_RADIUS};
    margin-right: 10px;
  }

  .tab-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: unset;
    box-shadow: none;
  }

  .delete-icon {
    color: ${COLOR.dangerText};
  }
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
