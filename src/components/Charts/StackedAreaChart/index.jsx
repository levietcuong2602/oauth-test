/* eslint-disable react/no-array-index-key */
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import Highcharts from 'highcharts';

import HightChartReact from '../../HighChart';
import { StyledStackedAreaChart, StyledLegendIcon } from './index.style';

const LegendIcon = ({ color, ...props }) => (
  <StyledLegendIcon {...props} viewBox="0 0 27 20">
    <rect
      x="0.499146"
      y="0.388245"
      width="23.7501"
      height="11.4103"
      fill={color}
    />
  </StyledLegendIcon>
);

const StackedAreaChart = ({
  series = [],
  categories = [],
  pieColors = Highcharts.defaultOptions.colors,
}) => {
  const ref = useRef(null);
  const [listVisible, setListVisible] = useState(() =>
    Array(series.length).fill(true),
  );
  useEffect(() => {
    setListVisible(() => Array(series.length).fill(true));
  }, [series]);

  const optionsMemo = useMemo(
    () => ({
      chart: {
        type: 'area',
      },
      title: {
        text: null,
      },
      xAxis: {
        categories,
        tickmarkPlacement: 'on',
        title: {
          enabled: false,
        },
      },
      yAxis: {
        title: {
          text: 'Billions',
        },
        labels: {
          formatter() {
            // eslint-disable-next-line react/no-this-in-sfc
            return this.value / 1000;
          },
        },
      },
      tooltip: {
        split: true,
        valueSuffix: ' millions',
      },
      plotOptions: {
        area: {
          stacking: 'normal',
          lineColor: '#666666',
          lineWidth: 1,
          marker: {
            lineWidth: 1,
            lineColor: '#666666',
          },
        },
      },
      series,
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
    }),
    [series, listVisible],
  );

  const legendItemClick = (index) => {
    if (!ref || !ref.current) return;
    const { chart } = ref.current;
    const item = chart.series[index];
    const { visible } = item;
    item.setVisible(!visible);

    setListVisible((prev) =>
      prev.map((val, i) => (i === index ? !visible : val)),
    );
  };

  return (
    <StyledStackedAreaChart>
      <div className="legend">
        {series.map((item, index) => {
          const color = pieColors[index % pieColors.length];

          return (
            <Button
              key={index.toString()}
              className={`legend-item ${
                !listVisible[index] && 'legend-item-hidden'
              }`}
              onClick={() => legendItemClick(index)}
            >
              <LegendIcon color={color} />
              <Typography className="legend-text">{item.name}</Typography>
            </Button>
          );
        })}
      </div>
      <div className="container">
        <HightChartReact ref={ref} options={optionsMemo} />
      </div>
    </StyledStackedAreaChart>
  );
};

export default StackedAreaChart;
