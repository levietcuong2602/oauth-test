import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { COLOR } from '@src/styles/color';

export const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    padding-left: 0px;
    padding-right: 0px;
  }

  & .MuiOutlinedInput-input {
    margin-left: 8px;
    margin-right: 8px;
    padding-left: 8px;
    padding-right: 8px;
    border-left: 1px dotted ${COLOR.border};
    border-right: 1px dotted ${COLOR.border};
  }

  .icon-input {
    cursor: pointer;
    font-size: 16px;
  }
`;
