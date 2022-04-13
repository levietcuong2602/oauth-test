import { styled } from '@mui/material/styles';
import { COLOR } from '@src/styles/color';

export const StyledCustomDateRangePicker = styled('div')`
  .MuiTextField-root {
    width: 100%;
  }
  .MuiOutlinedInput-root {
    width: 100%;
    padding-left: 10.5px;
    input {
      padding: 8.5px 0;
      height: fit-content;
      color: #6e6b7b;
    }
  }
  .MuiIconButton-root {
    color: #babfc7;
  }
  .MuiIconButton-label {
    color: #babfc7;
  }
  .MuiOutlinedInput-notchedOutline {
    border-style: dotted;
  }
`;

export const StyledCustomDatePickerRange = styled('div')`
  .reset-button {
    color: ${COLOR.light};
  }
  .to-text {
    color: ${COLOR.light};
    margin: 0 10px;
  }
  .arrow-icon {
    width: 15px;
    padding: 5px;
    color: ${COLOR.light};
  }
`;
