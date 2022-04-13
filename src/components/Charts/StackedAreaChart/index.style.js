import { SvgIcon } from '@mui/material';
import { styled } from '@mui/material/styles';
import { COLOR } from '@src/styles/color';

export const StyledLegendIcon = styled(SvgIcon)`
  color: ${(props) => props.color || COLOR.primary};
`;

export const StyledStackedAreaChart = styled('div')`
  position: relative;

  .label {
    font-size: 15px;
    font-weight: 500;
    color: #525f7f;
  }

  .container {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .total-value {
    position: absolute;
    z-index: 1;
    text-align: center;
    font-size: 24px;
    font-weight: 600;
    color: #525f7f;
  }

  .legend {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .legend-item {
    border-radius: 2px;
    text-transform: none;
    align-items: start;
    justify-content: start;
    padding: 4px 6px;
  }

  .legend-item-hidden {
    opacity: 0.5;
  }

  .legend-text {
    color: ${COLOR.black};
    font-size: 14px;
    font-weight: 500;
    margin-left: 8px;
  }
  .chartContainer {
    width: 100%;

    .highcharts-container {
      width: 100%;

      .highcharts-root {
        width: 100%;
        height: 100%;
      }
    }
  }
`;
