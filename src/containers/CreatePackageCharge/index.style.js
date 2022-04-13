import { styled } from '@mui/material/styles';
import { COLOR, TRANSPARENT_COLOR } from '@src/styles/color';

export const StyledCreatePackageCharge = styled('div')`
  width: 500px;

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: ${COLOR.tableHeader};
    padding: 6px 24px;

    .text {
      font-size: 16px;
      line-height: 24px;
      font-weight: 600;
      color: ${COLOR.bodyText};
    }

    .btn-close {
      color: ${COLOR.headingText};
    }
  }

  .content {
    padding: 15px 25px;

    .section-title {
      color: ${COLOR.light};
      font-weight: 500;
      font-size: 15px;
      line-height: 24px;
      text-transform: uppercase;
    }

    .item {
      margin: 15px 0;

      .item-header-row {
        margin-bottom: 10px;
      }
      .box-add-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 7px;
        margin-top: 10px;
        cursor: pointer;

        .icon-add {
          width: 30px;
          height: 30px;
          background: ${TRANSPARENT_COLOR.primary};
          color: ${COLOR.primary};
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          padding: 5px;
        }

        .text {
          color: ${COLOR.primary};
          font-weight: 600;
          font-size: 14px;
        }
      }

      .radio-button {
        & .MuiTypography-root {
          font-size: 14px;
          font-weight: 500;
        }
      }

      .radio-group {
        margin-bottom: 20px;
      }
    }

    .title {
      color: ${COLOR.appText};
      font-size: 14px;
      font-weight: 600;
      line-height: 24px;
    }
  }

  .actions {
    margin: 40px 25px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 20px;

    & .MuiLoadingButton-loadingIndicator {
      position: unset;
      left: unset;
      margin-right: 8px;
    }
  }

  .form-control-label {
    & .MuiTypography-root {
      font-size: 14px;
      font-weight: 500;
      color: ${COLOR.appText};
    }
    margin-left: 0;
  }

  .mr-24 {
    margin-right: 24px;
  }

  .dashed-border {
    .MuiOutlinedInput-notchedOutline {
      border-style: dotted;
    }
  }

  .label {
    display: inline-block;
    color: ${COLOR.appText};
    font-size: 14px;
    font-weight: 500;
    min-width: 85px;
    margin-right: 10px;
  }

  .fixed-width {
    width: 70px;
  }

  .recall-title {
    margin-top: 30px;
    text-transform: uppercase;
    font-size: 15px;
    color: #babfc7;
    font-weight: 500;
  }

  .number-input {
    width: 175px;
  }

  .form-control-label {
    display: flex;
    justify-content: space-between;
  }
`;
