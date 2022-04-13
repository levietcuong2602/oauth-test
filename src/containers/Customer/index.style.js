import { styled } from '@mui/material/styles';
import { COLOR } from '@src/styles/color';

export const StyledCustomer = styled('div')`
  .text-field {
    background-color: white;
    height: fit-content;
    width: 420px;
    margin-right: 20px;
    margin-top: 8px;
    border-radius: 20px;

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
`;
