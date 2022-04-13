import { styled } from '@mui/material/styles';
import { Switch } from '@mui/material';
import { COLOR } from '@src/styles/color';

const StyledSwitch = styled(Switch)`
  width: 42px;
  height: 24px;
  border-radius: 15px 15px;
  padding: 0;
  display: flex;

  & .MuiSwitch-switchBase {
    padding: 4px;
    &.Mui-checked {
      transform: translateX(18px);
      color: ${COLOR.white};
      & + .MuiSwitch-track {
        opacity: 1;
        background-color: ${(props) => props.checkedColor || COLOR.primary};
        border: none;
      }
    }
  }

  & .MuiSwitch-thumb {
    width: 16px;
    height: 16px;
  }

  & .MuiSwitch-track {
    border-radius: 26/2;
    opacity: 1;
    background-color: ${(props) => props.noneCheckedColor || COLOR.light};
  }
`;

export { StyledSwitch };
