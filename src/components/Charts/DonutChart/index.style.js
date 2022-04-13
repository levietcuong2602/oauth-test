import { SvgIcon } from '@mui/material';
import { styled } from '@mui/material/styles';
import { COLOR } from '@src/styles/color';

export const StyledLegendIcon = styled(SvgIcon)`
  color: ${(props) => props.color || COLOR.primary};
`;

export const StyledDonutChart = styled('div')`
  position: relative;
  max-width: 300px;
  margin: auto;

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
    flex-direction: column;
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
`;
