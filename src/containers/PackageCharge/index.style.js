import { styled } from '@mui/material/styles';
import { COLOR } from '@src/styles/color';

export const StyledPackageCharge = styled('div')`
  .heading-container {
    margin-bottom: 26px;
  }

  .heading-text {
    font-size: 24px;
    font-weight: 500;
    color: ${COLOR.headingText};
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

  .divider {
    margin: 0px 12px;
  }

  .status {
    color: ${COLOR.bodyText};
  }

  .status-active {
    color: #2dce8b;
  }

  .delete-icon {
    color: ${COLOR.dangerText};
  }
`;
