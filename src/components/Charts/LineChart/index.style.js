import { styled } from '@mui/material/styles';
import { COLOR } from '@src/styles/color';

export const StyledLegendLine = styled('div')`
  background-color: ${(props) => props.color};
  width: 37px;
  height: 4px;
  border-radius: 4px;
  margin-right: 9px;
`;

export const StyledLineChart = styled('div')`
  .chart {
    background-color: ${COLOR.white};
    box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.1);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding: 10px 10px 10px 22px;
  }

  .title {
    font-size: 16px;
    font-weight: 500;
    color: ${COLOR.bodyText};
  }

  .content {
    margin: 12px;
  }

  .legend {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin: 18px 0px;
    width: 75%;
    min-width: 350px;
    margin: auto;
  }

  .legend-item {
    display: inline-flex;
    align-items: center;
    margin-left: 13px;
    padding: 0px;
    border-radius: 2px;
    text-transform: none;
    justify-content: start;
  }

  .legend-item-hidden {
    opacity: 0.5;
  }

  .legend-text {
    color: ${COLOR.secondary};
    font-size: 12px;
    font-weight: 500;
    margin-left: 8px;
  }
`;
