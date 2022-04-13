import { Dialog } from '@mui/material';
import { styled } from '@mui/material/styles';
import { COLOR } from '@src/styles/color';

export const StyledPopup = styled(Dialog)`
  .MuiDialog-paper {
    min-width: ${(props) => props.width || '512px'};
  }

  .MuiDialogTitle-root {
    padding: 16px 24px 5px;
    color: ${COLOR.headingText};
    font-size: 21px;
    font-weight: 500;
  }

  .content-container {
    margin-top: -10px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .close-icon {
    padding: 2px 2px 0 0;
  }

  .cancel-button {
    color: ${COLOR.primary};
    margin-right: 20px;
  }

  .content {
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    color: ${COLOR.bodyText};
  }

  .MuiDialogActions-root {
    display: flex;
    justify-content: center;

    > :not(:first-of-type) {
      margin-left: 26px;
    }
  }
`;
